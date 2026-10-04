"use client";

import { buildWhatsAppLink } from "@/lib/format";

export function WhatsAppButton({
  whatsappNumber,
  itemName,
  customMessage,
  label = "Enroll Now",
}: {
  whatsappNumber: string;
  itemName: string;
  customMessage?: string | null;
  label?: string;
}) {
  const hasNumber = whatsappNumber && whatsappNumber.replace(/[^\d]/g, "").length > 5;

  if (!hasNumber) {
    return (
      <span className="inline-block w-full text-center rounded-sm border border-stone-light px-4 py-2.5 text-sm text-stone">
        Contact details coming soon
      </span>
    );
  }

  const href = buildWhatsAppLink(whatsappNumber, itemName, customMessage);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-sm bg-wine px-4 py-2.5 text-sm font-medium tracking-wide text-ivory transition-colors duration-200 hover:bg-wine-dark"
    >
      {label}
    </a>
  );
}
