import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MagazineUI from "./magazineUI";
import SelectedIcon from "@assets/icons/vector-select.svg";
import MagazineSkeleton from "@/components/ui/loaderSkleton/magazineSkeleton";
import { useTranslation } from "react-i18next";
import { useGetMagazinesQuery } from "@/services/api";
import { MagazineItem} from "@/interface";


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
    <div key={year} className="font-sans border border-gray-300 py-5 px-4">
      <button
        onClick={() => toggleYear(year)}
        className="flex items-center justify-between w-full text-[20px] md:text-[32px] leading-[100%] focus:outline-none"
      >
        <span>{t("magazine.booksIn", { year })}</span>
        <span
          className={`transform transition-transform duration-300 ${openYear.includes(year) ? "rotate-180" : "rotate-0"
            }`}
        >
          <img src={SelectedIcon} alt="Toggle" />
        </span>
      </button>

      <AnimatePresence>
        {openYear.includes(year) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-5">
              {items.map((mag) => (
                <MagazineUI
                  key={mag.id}
                  id={mag.id}
                  title={getLocalizedText(mag.title)}
                  coverImage={mag.card}
                  dateRange={`${mag.month}`}
                  year={`${mag.year}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="px-4 max-w--[1800px] md:px-[80px] pt-[78px] w-full mb-20">
      <div className="pt-6 md:mt-[30px]">
        <div className="flex items-center text-[14px] font-medium md:text-[18px] leading-[100%] gap-2">
          <Link to="/" className="hover:underline text-black">
            {t("breadcrumb.home")}
          </Link>
          <span className="text-black">{">"}</span>
          <span className="text-blue-500">{t("breadcrumb.magazines")}</span>
        </div>

        <h1 className="text-[20px] md:text-[32px] leading-[100%] mt-2 md:mt-5 font-serif mb-3 md:mb-[14px]">
          {t("magazine.title")}
        </h1>

        {isError ? (
          <div className="text-center text-red-500 mt-10">
            Ma'lumotlarni olishda xatolik yuz berdi
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-5">
            {Array(10)
              .fill(0)
              .map((_, index) => (
                <MagazineSkeleton key={index} />
              ))}
          </div>
        ) : (
          Object.entries(magazines)
            .sort((a, b) => Number(b[0]) - Number(a[0])) 
            .map(([year, items]) =>
              renderMagazineSection(year, items)
            )

        )}
      </div>
    </div>
  );
};

export default Magazine;
