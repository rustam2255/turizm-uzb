import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // Qo‘llab-quvvatlanadigan tillar ro‘yxati (til kodlari)
        supportedLngs: ["ru", "uz", "en"], // Faqat shu tillar ishlaydi
        nonExplicitSupportedLngs: true, // "uz-UZ" => "uz" ga yo‘naltiradi

        fallbackLng: ["ru", "uz", "en"], // Til topilmasa, fallback tillar
        debug: process.env.NODE_ENV === "development", // Faqat devda debug qilish

        react: {
            useSuspense: true, // Suspense ni o‘chirish (React bilan)
            // wait: true, // React i18next uchun kutish
            bindI18n: "languageChanged loaded", // Qachon rerender bo‘lishi kerak
        },

        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json", // JSON fayllar yo‘li
            crossDomain: false, // Agar kerak bo‘lsa cross-origin sozlamasi
        },

        detection: {
            order: [
                "localStorage",
                "cookie",
                "sessionStorage",
                "navigator",
                "htmlTag",
            ],
            lookupLocalStorage: "lang", // localStorage dan tilni qidirish kaliti
            lookupCookie: "i18next", // cookie nomi
            lookupSessionStorage: "i18nextLng", // sessionStorage nomi
            caches: ["localStorage", "cookie"], // tilni localStorage va cookie ga yozish
            cookieMinutes: 60 * 24 * 30, // cookie amal qilish muddati (30 kun)
            cookieDomain: window.location.hostname, // cookie domain
            excludeCacheFor: ["cimode"], // Bu tilni cache qilmaydi
        },

        saveMissing: process.env.NODE_ENV === "development", // Yo‘q kalitlarni saqlash devda
        missingKeyHandler: function (lng, ns, key, fallbackValue) {
            console.warn(`Missing translation key: ${key} in ${lng}/${ns}`);
        },

        ns: ["translation"], // Namespaces (odatda bitta)
        defaultNS: "translation", // Default namespace

        load: "languageOnly", // 'uz-UZ' emas faqat 'uz' ni yuklash
    });

export default i18n;
