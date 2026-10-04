"use client";

import { useMemo, useState } from "react";
import type { CatalogueItem } from "@/lib/types";
import { CatalogueCard } from "./CatalogueCard";

export function CatalogueGrid({
  items,
  whatsappNumber,
}: {
  items: CatalogueItem[];
  whatsappNumber: string;
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(items.map((item) => item.category));
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesQuery =
        q.length === 0 ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [items, query, activeCategory]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-stone-light pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`focus-ring rounded-full border px-4 py-1.5 text-sm transition-colors duration-200 ${
                activeCategory === category
                  ? "border-wine bg-wine text-ivory"
                  : "border-stone-light text-ink hover:border-wine"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <label className="relative block w-full sm:w-64">
          <span className="sr-only">Search the catalogue</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pieces or courses..."
            className="focus-ring w-full rounded-sm border border-stone-light bg-white/70 px-4 py-2.5 text-sm text-ink placeholder:text-stone"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center font-display text-lg italic text-stone">
          Nothing matches that search yet — try another word or category.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 py-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {filtered.map((item) => (
            <CatalogueCard key={item.id} item={item} whatsappNumber={whatsappNumber} />
          ))}
        </div>
      )}
    </div>
  );
}
