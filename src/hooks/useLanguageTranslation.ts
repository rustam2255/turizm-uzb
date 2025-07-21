import { useTranslation } from "react-i18next";

const allowedLangs = ['uz', 'ru', 'en'] as const;
type Lang = typeof allowedLangs[number];

export const useLanguageTranslation = () => {
  const { i18n } = useTranslation();
  const currentLangRaw = i18n.language;
  const currentLang: Lang = allowedLangs.includes(currentLangRaw as Lang) ? currentLangRaw as Lang : 'en';

  const getTranslatedField = <T extends Partial<Record<Lang, string>>>(
    field: T | undefined,
    fallback: Lang = 'en'
  ): string => {
    if (!field) return '';
    return field[currentLang] || field[fallback] || '';
  };

  return { currentLang, getTranslatedField };
};
