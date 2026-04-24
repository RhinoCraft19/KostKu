// app/(dashboard)/payments/page.tsx
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { PaymentTable } from "@/components/payments/PaymentTable";
import { PaymentFilterBar } from "@/components/payments/PaymentFilterBar";
import { InvoiceStatus } from "@prisma/client";

export const metadata = {
  title: "Pembayaran | KostOS",
  description: "Pantau dan kelola tagihan sewa bulanan semua tenant.",
};

export default async function PaymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Default: current month — for server-side summary cards
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const invoices = await prisma.invoice.findMany({
    where: {
      dueDate: { gte: start, lte: end },
      tenant: { room: { property: { ownerId: user.id } } }
    },
    include: {
      tenant: {
        include: {
          room: { select: { roomNumber: true } }
        }
      },
      paymentTransactions: {
        where: { status: "SUCCESS" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { dueDate: "asc" }
  });

  // Summary stats
  const totalAmount = invoices.reduce((sum: number, inv) => sum + inv.amount, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === InvoiceStatus.PAID)
    .reduce((sum: number, inv) => sum + inv.amount, 0);
  const unpaidCount = invoices.filter((inv) => inv.status === InvoiceStatus.UNPAID).length;

  const formatIDR = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Pembayaran"
        description="Pantau dan kelola tagihan sewa bulanan semua tenant."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-5 space-y-1">
          <p className="text-sm text-muted-foreground">Total Tagihan Bulan Ini</p>
          <p className="text-2xl font-bold">{formatIDR(totalAmount)}</p>
        </div>
        <div className="bg-card border rounded-xl p-5 space-y-1">
          <p className="text-sm text-muted-foreground">Sudah Dibayar</p>
          <p className="text-2xl font-bold text-green-600">{formatIDR(paidAmount)}</p>
        </div>
        <div className="bg-card border rounded-xl p-5 space-y-1">
          <p className="text-sm text-muted-foreground">Belum Bayar</p>
          <p className="text-2xl font-bold text-destructive">{unpaidCount} tagihan</p>
        </div>
      </div>

      {/* Filter + Table (client side — data fetched via usePayments hook) */}
      <PaymentFilterBar />
      <PaymentTable />
    </div>
  );
}
