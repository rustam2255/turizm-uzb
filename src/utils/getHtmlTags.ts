import he from "he";

export function stripHtmlTags(html: string): string {
  if (!html) return "";
  // 1. HTML taglarni olib tashlash
  const noTags = html.replace(/<[^>]*>?/gm, "");
  // 2. Entity-larni oddiy belgiga aylantirish
  return he.decode(noTags);
}
