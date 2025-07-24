import { BankDetailBody, BankDetailDescription, ShopDetailBody, ShopDetailDescription } from "@/interface";

type MultilingualText = {
  en?: string;
  uz?: string;
  ru?: string;
};

export const getLocalized = (
  textObj: MultilingualText,
  lang: string = "en"
): string => {
  return textObj[lang as keyof MultilingualText] || textObj["en"] || "";
};

type Lang = "uz" | "ru" | "en";

export const normalizeDescription = (desc: ShopDetailDescription): Record<Lang, string> => ({
  en: desc.description_en,
  ru: desc.description_ru,
  uz: desc.description_uz,
});

export const normalizeBody =(body: ShopDetailBody): Record<Lang, string> => ({
  en: body.body_en,
  ru: body.body_ru,
  uz: body.body_uz
})

export const bankNormalizeBody = (body: BankDetailBody): Record<Lang, string> => ({
  en: body.en,
  ru: body.ru,
  uz: body.uz
})
export const bankNormalizeDescription = (descr: BankDetailDescription): Record<Lang, string> => ({
  en: descr.en,
  ru: descr.ru,
  uz: descr.uz
})


export const getLocalizedText = (
  text: string | Partial<Record<Lang, string>> | undefined,
  lang: Lang
): string => {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[lang] || text.en || "";
};
export const getLocalizedTextDescr = (
  text: MultilingualText | undefined,
  lang: Lang
): string => {
  if (!text) return "";
  return text[lang] || text.en || "";
};