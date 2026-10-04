import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CatalogueItem } from "@/lib/types";
import { AdminItemForm } from "@/components/AdminItemForm";

export const revalidate = 0;

export default async function EditItemPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: item } = await supabase
    .from("catalogue_items")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!item) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-ivory">Edit catalogue item</h1>
      <AdminItemForm item={item as CatalogueItem} />
    </div>
  );
}
