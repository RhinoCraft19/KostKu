import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = (
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)!;

/**
 * Supabase browser client for use in Client Components.
 *
 * Usage:
 *   import { createClient } from '@/utils/supabase/client'
 *   const supabase = createClient()
 */
export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseKey);
