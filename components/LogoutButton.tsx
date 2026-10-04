"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="focus-ring rounded-sm border border-white/20 px-4 py-2 text-sm text-ivory transition-colors hover:border-wine hover:text-wine"
    >
      Log out
    </button>
  );
}
