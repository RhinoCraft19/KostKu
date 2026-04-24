import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Initialize Supabase Client using Service Role Key
    // Service role key is required to bypass RLS for background billing
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Tentukan bulan dan tahun tagihan
    const now = new Date();
    // Jika hari ini tgl 1, kita buat tagihan untuk bulan ini
    // Target jatuh tempo tgl 10 bulan ini
    const billingMonth = now.getMonth();
    const billingYear = now.getFullYear();
    const dueDate = new Date(billingYear, billingMonth, 10);
    // Declare monthName here so it's accessible in the response below
    const monthName = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(now);

    console.log(`Starting billing generation for ${billingMonth + 1}/${billingYear}...`);

    // 3. Ambil semua tenant yang aktif (kontrak belum berakhir)
    const { data: tenants, error: tenantError } = await supabaseClient
      .from('Tenant')
      .select('id, monthlyRent')
      .gt('endDate', now.toISOString());

    if (tenantError) throw tenantError;

    console.log(`Found ${tenants?.length || 0} active tenants.`);

    if (!tenants || tenants.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active tenants found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // 4. Siapkan data tagihan
    const paymentsToUpsert = tenants.map((tenant) => {
      const notes = `Tagihan Otomatis - ${monthName} ${billingYear}`;

      return {
        tenantId: tenant.id,
        amount: tenant.monthlyRent,
        dueDate: dueDate.toISOString().split('T')[0] + 'T00:00:00Z', // Standardize date
        status: 'UNPAID',
        notes: notes,
        updatedAt: new Date().toISOString()
      };
    });

    // 5. Upsert ke tabel Payment
    // Memerlukan constraint UNIQUE (tenantId, dueDate) di level database
    const { data: result, error: upsertError } = await supabaseClient
      .from('Payment')
      .upsert(paymentsToUpsert, { 
        onConflict: 'tenantId,dueDate',
        ignoreDuplicates: true // Jangan timpa jika sudah ada (agar status UNPAID tidak me-reset PAID)
      })
      .select();

    if (upsertError) {
      console.error("Error upserting payments:", upsertError);
      throw upsertError;
    }

    console.log(`Job complete. Records processed: ${result?.length || 0}`);

    return new Response(
      JSON.stringify({ 
        message: `Billing generation complete. ${result?.length || 0} records processed.`,
        month: monthName,
        year: billingYear
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Function failed:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    )
  }
})
