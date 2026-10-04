export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildWhatsAppLink(
  whatsappNumber: string,
  itemName: string,
  customMessage?: string | null
): string {
  const digits = whatsappNumber.replace(/[^\d]/g, "");
  const message =
    customMessage && customMessage.trim().length > 0
      ? customMessage
      : `Hello SACTORIA FASHION INSTITUTE, I am interested in ${itemName}. Please provide more information.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
