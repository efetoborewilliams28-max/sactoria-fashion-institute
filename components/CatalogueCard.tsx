import Image from "next/image";
import type { CatalogueItem } from "@/lib/types";
import { formatNaira } from "@/lib/format";
import { WhatsAppButton } from "./WhatsAppButton";

export function CatalogueCard({
  item,
  whatsappNumber,
}: {
  item: CatalogueItem;
  whatsappNumber: string;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-sm bg-white/60">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-light">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone">
            <span className="font-display text-sm italic">No image yet</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-sm bg-ink/80 px-2.5 py-1 text-[11px] tracking-wide text-ivory">
          {item.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg leading-snug text-ink">{item.name}</h3>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-stone">
          {item.description}
        </p>
        <p className="font-display text-base text-wine">{formatNaira(item.price)}</p>
        <div className="pt-1">
          <WhatsAppButton
            whatsappNumber={whatsappNumber}
            itemName={item.name}
            customMessage={item.whatsapp_message}
          />
        </div>
      </div>
    </article>
  );
}
