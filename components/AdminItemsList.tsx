"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/format";
import type { CatalogueItem } from "@/lib/types";

export function AdminItemsList({ initialItems }: { initialItems: CatalogueItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function toggleVisibility(item: CatalogueItem) {
    setBusyId(item.id);
    const { error } = await supabase
      .from("catalogue_items")
      .update({ is_visible: !item.is_visible })
      .eq("id", item.id);

    if (!error) {
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, is_visible: !entry.is_visible } : entry
        )
      );
    }
    setBusyId(null);
  }

  async function deleteItem(item: CatalogueItem) {
    const confirmed = window.confirm(`Delete "${item.name}"? This cannot be undone.`);
    if (!confirmed) return;

    setBusyId(item.id);
    const { error } = await supabase.from("catalogue_items").delete().eq("id", item.id);

    if (!error) {
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      router.refresh();
    }
    setBusyId(null);
  }

  if (items.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-white/20 p-12 text-center">
        <p className="font-display text-xl italic text-ivory">
          No catalogue items yet
        </p>
        <p className="mt-2 text-sm text-stone-light">
          Add your first course or piece to bring the catalogue to life.
        </p>
        <Link
          href="/admin/items/new"
          className="focus-ring mt-6 inline-block rounded-sm bg-wine px-5 py-2.5 text-sm text-ivory hover:bg-wine-dark"
        >
          Add catalogue item
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-sm border border-white/10">
      <table className="w-full text-left text-sm text-ivory">
        <thead className="bg-white/5 text-xs uppercase tracking-wide text-stone-light">
          <tr>
            <th className="px-4 py-3">Item</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {items.map((item) => (
            <tr key={item.id} className={busyId === item.id ? "opacity-50" : ""}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-sm bg-white/10">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <span className="font-display">{item.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-stone-light">{item.category}</td>
              <td className="px-4 py-3">{formatNaira(item.price)}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => toggleVisibility(item)}
                  disabled={busyId === item.id}
                  className={`focus-ring rounded-full px-3 py-1 text-xs ${
                    item.is_visible
                      ? "bg-green-900/40 text-green-300"
                      : "bg-white/10 text-stone-light"
                  }`}
                >
                  {item.is_visible ? "Visible" : "Hidden"}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-3">
                  <Link
                    href={`/admin/items/${item.id}/edit`}
                    className="focus-ring text-sm text-ivory underline decoration-white/30 underline-offset-4 hover:decoration-wine"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteItem(item)}
                    disabled={busyId === item.id}
                    className="focus-ring text-sm text-red-400 underline decoration-red-400/30 underline-offset-4 hover:decoration-red-400"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
