export function stripHtmlTags(html: string) {
  if (!html) return "";
  return html
    // style va script qismlarini olib tashlash
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    // <br>, <p>, <div>, <li> ni yangi qatorga almashtirish
    .replace(/<\/(p|div|li)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    // qolgan HTML teglarini olib tashlash
    .replace(/<[^>]*>/g, "")
    // ketma-ket bo‘sh qatorlarni 1 taga qisqartirish
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    // boshidagi va oxiridagi bo‘sh joylarni olib tashlash
    .trim();
}
