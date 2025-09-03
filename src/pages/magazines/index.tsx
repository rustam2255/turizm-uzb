// Magazine.tsx - Asosiy sahifa
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MagazineUI from "./magazineUI";
import SelectedIcon from "@assets/icons/vector-select.svg";
import MagazineSkeleton from "@/components/ui/loaderSkleton/magazineSkeleton";
import { useTranslation } from "react-i18next";
import { useGetMagazinesQuery } from "@/services/api";
import { MagazineItem } from "@/interface";
import { Helmet } from "react-helmet-async";
const Magazine: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0] as "uz" | "ru" | "en";

  const { data: magazines = {}, isLoading, isError } = useGetMagazinesQuery();

  const [openYear, setOpenYear] = useState<string[]>(["2025", "2024"]);

  const toggleYear = (year: string) => {
    setOpenYear((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const getLocalizedText = (
    field: { uz?: string; en?: string; ru?: string } | undefined
  ): string => {
    if (!field) return "";
    return field[currentLang] || field.en || "";
  };

  const renderMagazineSection = (year: string, items: MagazineItem[]) => (
    <div
      key={year}
      className="font-sans border border-sky-200 hover:border-sky-300 py-6 px-5  shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-sky-50/30 to-blue-50/30 backdrop-blur-sm"
    >
      <button
        onClick={() => toggleYear(year)}
        className="flex items-center justify-between w-full text-[20px] md:text-[32px] leading-[100%] focus:outline-none group"
      >
        <span
          className="text-sky-900  dark:text-sky-500 font-semibold group-hover:text-sky-600 transition-colors duration-300"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
        >
          <h1>
            {t("magazine.booksIn", { year })}
          </h1>

        </span>  
          <img src={SelectedIcon} loading="lazy" alt="Toggle" className="w-5 h-5 filter drop-shadow-sm" />
      </button>

      <AnimatePresence>
        {openYear.includes(year) && (
          <div
            className="overflow-hidden"
          >
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6"
            >
              {items.map((mag) => (
                <div
                  key={mag.id}
                >
                  <MagazineUI
                    id={mag.id}
                    title={getLocalizedText(mag.title)}
                    coverImage={mag.card}
                    dateRange={`${mag.month}`}
                    year={`${mag.year}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-30 mb-20 min-h-screen">
      <Helmet>
        <title>Jurnallar | Rasmiy sayti, Tourism Uzbekistan Journal</title>
        <meta
          name="description"
          content={t(
            "seo.magazineDescription",
            "O‘zbekiston bo‘yicha barcha elektron jurnallarni bu sahifadan topishingiz mumkin. PDF ko‘rinishida yuklab oling."
          )}
        />
        <meta
          name="keywords"
          content="O‘zbekiston jurnallari, elektron jurnal, magazine Uzbekistan, PDF download, mehmonxonalar, hotels, o'zbekcha kitoblar, "
        />

        {/* Canonical */}
        <link rel="canonical" href="https://tourism-uzbekistan.uz/" />

        {/* Open Graph (Facebook, Telegram preview) */}
        <meta property="og:title" content="O‘zbekiston elektron jurnallari" />
        <meta
          property="og:description"
          content="Barcha yangi jurnallarni elektron ko‘rinishda bu sahifada toping."
        />
        <meta
          property="og:image"
          content="https://api.tourism-uzbekistan.uz/media/magazines/Screenshot_2025-08-26_at_16.17.42.png"
        />
        <meta property="og:url" content="https://tourism-uzbekistan.uz/magazines" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="O‘zbekiston elektron jurnallari"
        />
        <meta
          name="twitter:description"
          content="Barcha yangi jurnallarni elektron ko‘rinishda bu sahifada toping."
        />
        <meta
          name="twitter:image"
          content="https://api.tourism-uzbekistan.uz/media/magazines/Screenshot_2025-08-26_at_16.17.42.png"
        />
      </Helmet>
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sky-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>
      </div>

      <div
        className="pt-6 md:mt-[30px] relative z-10"
      >
        {/* Breadcrumb */}
        <div
          className="flex items-center text-[14px] font-medium md:text-[18px] leading-[100%] gap-2 mb-4"
        >
          <Link to="/" className="hover:underline transition-colors duration-200">
            {t("breadcrumb.home")}
          </Link>
          <span
            className=""
          >
            {">"}
          </span>
          <span className=" font-semibold" style={{ color: 'rgba(25,110,150,255)' }}>{t("breadcrumb.magazines")}</span>
        </div>


        {/* Content */}
        {isError ? (
          <div
            className="text-center mt-10 p-8 bg-red-50 border border-red-200 rounded-2xl"
          >
            <div className="text-red-500 text-lg font-medium">Ma'lumotlarni olishda xatolik yuz berdi</div>
          </div>
        ) : isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-5"
          >
            {Array(10)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                >
                  <MagazineSkeleton />
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(magazines)
              .sort((a, b) => Number(b[0]) - Number(a[0]))
              .map(([year, items]) => (
                <div
                  key={year}
                >
                  {renderMagazineSection(year, items)}
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Magazine;