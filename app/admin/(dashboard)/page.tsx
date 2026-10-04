import { createClient } from "@/lib/supabase/server";
import type { CatalogueItem } from "@/lib/types";
import { AdminItemsList } from "@/components/AdminItemsList";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const { data: items } = await supabase
    .from("catalogue_items")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ivory">Catalogue items</h1>
          <p className="mt-1 text-sm text-stone-light">
            Add, edit, hide or remove items. Changes appear on the public site immediately.
          </p>
        </div>
      </div>
      <AdminItemsList initialItems={(items ?? []) as CatalogueItem[]} />
    </div>
  );
}
