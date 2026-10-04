import { createClient } from "@/lib/supabase/server";
import type { CatalogueItem, SiteSettings } from "@/lib/types";
import { CatalogueGrid } from "@/components/CatalogueGrid";

export const revalidate = 0;

async function getData() {
  const supabase = createClient();

  const [{ data: items }, { data: settings }] = await Promise.all([
    supabase
      .from("catalogue_items")
      .select("*")
      .eq("is_visible", true)
      .order("created_at", { ascending: false }),
    supabase.from("site_settings").select("*").eq("id", 1).single(),
  ]);

  return {
    items: (items ?? []) as CatalogueItem[],
    settings: settings as SiteSettings | null,
  };
}

export default async function HomePage() {
  const { items, settings } = await getData();

  const instituteName = settings?.institute_name || "SACTORIA FASHION INSTITUTE";
  const tagline = settings?.tagline || "Learn. Create. Design. Become.";
  const whatsappNumber = settings?.whatsapp_number || "";

  return (
    <main className="min-h-screen bg-ivory">
      <header className="border-b border-stone-light">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-14 text-center sm:py-20">
          {settings?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo_url}
              alt={`${instituteName} logo`}
              className="mb-6 h-16 w-auto object-contain"
            />
          ) : null}
          <p className="text-xs tracking-widest2 text-stone">Sactoria presents</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-ink sm:text-6xl">
            {instituteName}
          </h1>
          <p className="mt-5 font-display text-xl italic text-wine sm:text-2xl">
            {tagline}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-stone">
            {settings?.address ? <span>{settings.address}</span> : null}
            {settings?.phone ? <span>{settings.phone}</span> : null}
            {settings?.email ? <span>{settings.email}</span> : null}
          </div>

          <div className="mt-4 flex justify-center gap-5">
            {settings?.instagram_url ? (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring text-sm text-ink underline decoration-stone-light underline-offset-4 hover:decoration-wine"
              >
                Instagram
              </a>
            ) : null}
            {settings?.facebook_url ? (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring text-sm text-ink underline decoration-stone-light underline-offset-4 hover:decoration-wine"
              >
                Facebook
              </a>
            ) : null}
            {settings?.tiktok_url ? (
              <a
                href={settings.tiktok_url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring text-sm text-ink underline decoration-stone-light underline-offset-4 hover:decoration-wine"
              >
                TikTok
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        {items.length === 0 ? (
          <p className="py-20 text-center font-display text-xl italic text-stone">
            The catalogue is being prepared — new pieces are on their way.
          </p>
        ) : (
          <CatalogueGrid items={items} whatsappNumber={whatsappNumber} />
        )}
      </section>

      <footer className="border-t border-stone-light py-10 text-center text-xs text-stone">
        © {new Date().getFullYear()} {instituteName}. All rights reserved.
      </footer>
    </main>
  );
}
