import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";
import { AdminSettingsForm } from "@/components/AdminSettingsForm";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-ivory">Site settings</h1>
      <AdminSettingsForm settings={settings as SiteSettings} />
    </div>
  );
}
