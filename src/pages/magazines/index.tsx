// Magazine.tsx - Asosiy sahifa
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
    <motion.div 
      key={year} 
      className="font-sans border border-sky-200 hover:border-sky-300 py-6 px-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-sky-50/30 to-blue-50/30 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 10px 25px rgba(56, 178, 237, 0.15)"
      }}
    >
      <motion.button
        onClick={() => toggleYear(year)}
        className="flex items-center justify-between w-full text-[20px] md:text-[32px] leading-[100%] focus:outline-none group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.span 
          className="text-sky-700 font-semibold group-hover:text-sky-600 transition-colors duration-300"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
        >
          {t("magazine.booksIn", { year })}
        </motion.span>
        <motion.span
          className={`transform transition-all duration-500 p-2 rounded-full bg-sky-100 hover:bg-sky-200 ${
            openYear.includes(year) ? "rotate-180 bg-sky-200" : "rotate-0"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={SelectedIcon} alt="Toggle" className="w-5 h-5 filter drop-shadow-sm" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {openYear.includes(year) && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 0.95 }}
            animate={{ height: "auto", opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="overflow-hidden"
          >
            {/* Decorative line */}
            <motion.div 
              className="w-full h-0.5 bg-gradient-to-r from-transparent via-sky-300 to-transparent my-4 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {items.map((mag, index) => (
                <motion.div
                  key={mag.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -8,
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                  <MagazineUI
                    id={mag.id}
                    title={getLocalizedText(mag.title)}
                    coverImage={mag.card}
                    dateRange={`${mag.month}`}
                    year={`${mag.year}`}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className=" max-w-[1500px]  mx-auto w-full mb-20 min-h-screen">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sky-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>
      </div>
      
      <motion.div 
        className="pt-6 md:mt-[30px] relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Breadcrumb */}
        <motion.div 
          className="flex items-center text-[14px] font-medium md:text-[18px] leading-[100%] gap-2 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link to="/" className="hover:underline transition-colors duration-200">
            {t("breadcrumb.home")}
          </Link>
          <motion.span 
            className="text-sky-400"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            {">"}
          </motion.span>
          <span className=" font-semibold" style={{ color: 'rgba(77,199,232,1)' }}>{t("breadcrumb.magazines")}</span>
        </motion.div>


        {/* Content */}
        {isError ? (
          <motion.div 
            className="text-center mt-10 p-8 bg-red-50 border border-red-200 rounded-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-red-500 text-lg font-medium">Ma'lumotlarni olishda xatolik yuz berdi</div>
          </motion.div>
        ) : isLoading ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {Array(10)
              .fill(0)
              .map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <MagazineSkeleton />
                </motion.div>
              ))}
          </motion.div>
        ) : (
          <motion.div className="space-y-6">
            {Object.entries(magazines)
              .sort((a, b) => Number(b[0]) - Number(a[0])) 
              .map(([year, items], index) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {renderMagazineSection(year, items)}
                </motion.div>
              ))
            }
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Magazine;