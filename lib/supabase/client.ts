"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client. Uses only the public anon key —
// safe to ship to the client because Row Level Security enforces
// what anon vs authenticated users may actually do.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
