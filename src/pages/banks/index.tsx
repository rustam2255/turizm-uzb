import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { useGetBanksQuery, useGetCitiesHotelQuery } from "@/services/api";
import SkeletonCard from "@/components/ui/loaderSkleton/travelDestinationSkleton";
import IMAGE1 from "@/assets/images/banks.png";
import IMAGE from "@/assets/images/place3.png";
import { slugify } from "@/utils/slugify";

const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;

type Lang = "uz" | "ru" | "en";

interface BankCity {
  id: number;
  name: string | Record<Lang, string>;
}

interface Bank {
  id: number;
  name: string;
  city: {
    name_uz: string;
    name_ru: string;
    name_en: string;
  };
  latitude: number;
  longitude: number;
  images: {
    id: number;
    photo: string;
  }[];
}

const getLocalizedText = (
  text: string | Record<Lang, string> | undefined,
  lang: Lang
): string => {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[lang] || text.en || "";
};

const BankCard: React.FC<{ bank: Bank; lang: Lang }> = ({ bank, lang }) => {
  const navigate = useNavigate();
  const firstImage =
    bank.images && bank.images.length > 0 ? `${MEDIA_URL}${bank.images[0].photo}` : IMAGE;
  const secondImage =
    bank.images && bank.images.length > 1 ? `${MEDIA_URL}${bank.images[1].photo}` : IMAGE1;

  return (
    <motion.div
      className="flex flex-col w-full h-[300px] md:h-[300px] bg-white rounded-xl shadow-md shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40 transition-shadow duration-300 border border-[#4DC7E8]/10 overflow-hidden cursor-pointer"
      onClick={() => navigate(`/services/bank/${bank.id}-${slugify(bank.name)}`)}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
    >
      <div
        className="relative h-[160px] md:h-[200px] overflow-hidden mb-3 rounded-t-xl group"
        style={{ perspective: "1000px" }}
      >
        <div
          className="w-full h-full transition-transform duration-700 ease-in-out transform-gpu group-hover:[transform:rotateY(180deg)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Image */}
          <img
            src={firstImage}
            alt={bank.name}
            className="w-full h-full object-cover absolute top-0 left-0 rounded-t-xl"
            style={{ backfaceVisibility: "hidden" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMAGE1;
            }}
          />
          <div className="absolute inset-0 bg-[#4DC7E8]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />

          {/* Back Image */}
          <img
            src={secondImage}
            alt={bank.name}
            className="w-full h-full object-cover absolute top-0 left-0 rounded-t-xl"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMAGE;
            }}
          />
        </div>
      </div>
      <motion.div
        className="flex flex-col flex-grow p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.h2
          className="text-[16px] md:text-[20px] font-semibold mb-2 line-clamp-2 text-[#131313]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {bank.name}
        </motion.h2>
        <motion.div
          className="flex items-center gap-1 text-gray-500 text-[14px] md:text-[15px] mt-auto pt-2 border-t border-[#4DC7E8]/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <MapPin size={16} className="text-[#4DC7E8] mr-1" />
          <span className="truncate">
            {getLocalizedText(
              {
                uz: bank.city.name_uz,
                ru: bank.city.name_ru,
                en: bank.city.name_en,
              },
              lang
            )}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Banks: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language.split("-")[0] as Lang) || "en";
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const {
    data: cities = [],
    isLoading: loadingCities,
    isError: errorCities,
  } = useGetCitiesHotelQuery();

  const {
    data: bankData,
    isLoading: loadingBanks,
    isError: errorBanks,
  } = useGetBanksQuery({
    page: currentPage,
    search: searchQuery || undefined,
    city: selectedCity || undefined,
  });

  const banks: Bank[] = bankData?.results || [];
  const totalPages = Math.ceil((bankData?.count || 0) / pageSize);
  const isLoading = loadingBanks || loadingCities;

  return (
    <motion.div
      className="max-w-[1800px] mx-auto px-4 md:px-8 py-6 md:py-10 bg-gradient-to-b from-white to-[#4DC7E8]/5 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb */}
      <motion.div
        className="flex items-center text-[14px] md:text-[16px] font-medium gap-2 text-[#131313]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Link to="/" className="hover:text-[#4DC7e8] transition-colors duration-200">
          {t("breadcrumb.home")}
        </Link>
        <span className="text-[#4DC7E8">&gt;</span>
        <Link to="/services" className="hover:text-[#4DC7E8] transition-colors duration-200">
          <span>{t("services.title")}</span>
        </Link>
        <span className="text-[#4DC7E8">&gt;</span>
        <span className="text-[#4DC7E8] font-semibold">{t("services.banks")}</span>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="text-[20px] md:text-[30px] font-bold mt-3 md:mt-6 mb-4 text-[#131313]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {t("services.banks")}
      </motion.h1>

      {/* Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.input
          type="text"
          placeholder={t("placeholder.bank")}
          className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-[#4DC7E8]/50 focus:border-[#4DC7E8] focus:ring-2 focus:ring-[#4DC7E8]/30 text-sm md:text-base placeholder:text-[#4DC7E8]/70 bg-white shadow-sm hover:shadow-[#4DC7E8]/30 transition-all duration-300"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        />
        <motion.select
          onChange={(e) => {
            setSelectedCity(String(e.target.value) || null);
            setCurrentPage(1);
          }}
          value={selectedCity || ""}
          className="w-full sm:w-1/3 px-4 py-2 rounded-lg border border-[#4DC7E8]/50 focus:border-[#4DC7E8] focus:ring-2 focus:ring-[#4DC7E8]/30 text-sm md:text-base bg-white shadow-sm hover:shadow-[#4DC7E8]/30 transition-all duration-300"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <option value="">{t("travel.select_city")}</option>
          {cities.map((city: BankCity) => (
            <option key={city.id} value={city.id}>
              {getLocalizedText(city.name, lang)}
            </option>
          ))}
        </motion.select>
      </motion.div>

      {/* Error */}
      {(errorBanks || errorCities) && (
        <motion.div
          className="text-center text-red-500 text-[16px] md:text-[18px] font-medium my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("error.failed_to_load_data")}
        </motion.div>
      )}

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <AnimatePresence>
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <SkeletonCard />
                </motion.div>
              ))
            : banks.map((bank) => (
                <motion.div
                  key={bank.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: banks.indexOf(bank) * 0.1 }}
                >
                  <BankCard bank={bank} lang={lang} />
                </motion.div>
              ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty */}
      {!isLoading && banks.length === 0 && (
        <motion.p
          className="text-center text-gray-600 text-[16px] md:text-[18px] font-medium mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("common.noData")}
        </motion.p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex flex-wrap justify-center items-center gap-2 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg font-medium text-sm md:text-base transition-all duration-300 shadow-sm ${
                currentPage === page
                  ? "bg-[#4DC7E8] text-white shadow-[#4DC7E8]/50"
                  : "bg-white text-[#4DC7E8] border border-[#4DC7E8]/50 hover:bg-[#4DC7E8]/10 hover:shadow-[#4DC7E8]/30"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (page - 1) * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              {page}
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Banks;