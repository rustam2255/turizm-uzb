import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;
import { useGetResortsQuery, useGetCitiesHotelQuery } from "@/services/api";
import SkeletonCard from "@/components/ui/loaderSkleton/travelDestinationSkleton";
import FallbackImage from "@assets/images/place3.png";

type Lang = "uz" | "ru" | "en";

interface MultilangText {
  uz?: string;
  ru?: string;
  en?: string;
}

interface Resort {
  id: number;
  name: string;
  description: MultilangText;
  city: MultilangText;
  type: string;
  images?: {
    id: number;
    photo: string;
  }[];
}

interface City {
  id: number;
  name: string | Record<Lang, string>;
}

const getLocalizedTextDescr = (text: MultilangText | undefined, lang: Lang): string => {
  if (!text) return "";
  return text[lang] || text.en || "";
};

const getLocalizedText = (text: string | Record<Lang, string> | undefined, lang: Lang): string => {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[lang] || text.en || "";
};

const ResortCard: React.FC<{ resort: Resort; lang: Lang }> = ({ resort, lang }) => {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const navigate = useNavigate();

  const firstImage = resort.images && resort.images.length > 0 ? `${MEDIA_URL}${resort.images[0].photo}` : FallbackImage;
  const secondImage = resort.images && resort.images.length > 1 ? `${MEDIA_URL}${resort.images[1].photo}` : firstImage;

  return (
    <motion.div
      className="flex flex-col w-full h-[360px] md:h-[420px] bg-white rounded-xl shadow-md shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40 transition-shadow duration-300 border border-[#4DC7E8]/10 overflow-hidden"
      onClick={() => navigate(`/services/resort/${resort.id}-${resort.name}`)}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
    >
      <motion.div
        className="relative h-[160px] md:h-[200px] rounded-t-xl overflow-hidden"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="relative w-full h-full transition-transform duration-700 ease-in-out transform-style-preserve-3d"
          style={{
            transformStyle: "preserve-3d",
            transform: isImageHovered ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <motion.img
              src={firstImage}
              alt={resort.name}
              className="w-full h-full object-cover rounded-t-xl"
              onError={(e) => (e.currentTarget.src = FallbackImage)}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-[#4DC7E8]/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
          </motion.div>
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <motion.img
              src={secondImage}
              alt={`${resort.name} - 2`}
              className="w-full h-full object-cover rounded-t-xl"
              onError={(e) => (e.currentTarget.src = FallbackImage)}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-[#4DC7E8]/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div
        className="flex flex-col flex-grow p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h2
          className="text-[16px] md:text-[20px] font-semibold mb-2 line-clamp-1 text-[#131313]"
        >
          {resort.name}
        </h2>
        <motion.p
          className="text-[14px] md:text-[15px] font-medium text-gray-600 line-clamp-3 flex-grow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {getLocalizedTextDescr(resort.description, lang)}
        </motion.p>
        <motion.div
          className="flex justify-between items-center text-gray-500 text-sm mt-auto pt-2 border-t border-[#4DC7E8]/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-rgba(25,110,150,255)" />
            <span className="truncate">{getLocalizedText(resort.city as Record<Lang, string>, lang)}</span>
          </div>
          <span className="truncate text-rgba(25,110,150,255)">{resort.type}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Resort: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language.split("-")[0] as Lang) || "en";

  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const {
    data: cities = [],
    isLoading: loadingCities,
    isError: errorCities,
  } = useGetCitiesHotelQuery();

  const {
    data: resortData,
    isLoading: loadingResorts,
    isError: errorResorts,
  } = useGetResortsQuery({
    city: selectedCity || undefined,
    search: searchQuery || undefined,
    page: currentPage,
  });

  const resorts: Resort[] = resortData?.results || [];
  const totalPages = Math.ceil((resortData?.count || 0) / pageSize);
  const isLoading = loadingResorts || loadingCities;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 3; 

    // Previous button
    if (currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="flex items-center px-3 py-2 text-gray-500 hover:text-blue-500 hover:bg-orange-50 rounded-lg transition-colors duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="ml-1 hidden sm:inline">{t("media.previous")}</span>
        </button>
      );
    }

    // Page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Birinchi sahifa
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
            currentPage === 1
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:text-sky-100 hover:bg-sky-400"
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="start-ellipsis" className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Joriy sahifa atrofidagi sahifalar
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
            i === currentPage
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:text-sky-100 hover:bg-sky-400"
          }`}
        >
          {i}
        </button>
      );
    }

    // Ellipsis (agar kerak bo'lsa)
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="end-ellipsis" className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      }
      // Oxirgi sahifa
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
            currentPage === totalPages
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:text-sky-100 hover:bg-sky-400"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="flex items-center px-3 py-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors duration-200"
        >
          <span className="mr-1 hidden sm:inline">{t("media.next")}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      );
    }

    return buttons;
  };

  return (
    <motion.div
      className="max-w-[1600px] mx-auto px-4 md:px-[80px] py-6 md:py-10 bg-gradient-to-b from-white to-[#4DC7E8]/5 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb */}
      <motion.div
        className="flex items-center text-[14px] md:text-[16px] font-medium gap-2 text-[#131313]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Link to="/" className=" transition-colors duration-200">
          {t("breadcrumb.home")}
        </Link>
        <span className="rgba(25,110,150,255)">&gt;</span>
        <Link to="/services" className=" transition-colors duration-200">
          {t("services.title")}
        </Link>
        <span className="rgba(25,110,150,255)">&gt;</span>
        <span className="text-sky-900 font-semibold">{t("services.resort")}</span>
      </motion.div>

      {/* Title */}
      <motion.p
        className="text-[20px] md:text-[30px] font-bold mt-3 md:mt-6 mb-4 text-sky-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {t("services.resort")}
      </motion.p>

      {/* Filter */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <motion.input
          type="text"
          placeholder={t("placeholder.resort")}
          className="w-full sm:w-1/2 px-4 py-2 rounded-lg border font-semibold border-rgba(25,110,150,255) focus:border-[#4DC7E8] focus:ring-2 focus:ring-[#4DC7E8]/30 text-sm md:text-base placeholder:text-sky-900 bg-white shadow-sm hover:shadow-[#4DC7E8] transition-all duration-300"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        />
        <motion.select
          onChange={(e) => {
            setSelectedCity(String(e.target.value) || null);
            setCurrentPage(1);
          }}
          value={selectedCity || ""}
          className="w-full sm:w-1/3 px-4 py-2 rgba(25,110,150,255) text-sky-900 font-semibold rounded-lg border border-rgba(25,110,150,255) focus:border-[#4DC7E8] focus:ring-2 focus:ring-[#4DC7E8]/30 text-sm md:text-base bg-white shadow-sm hover:shadow-[#4DC7E8]/30 transition-all duration-300"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <option value="">{t("travel.select_city")}</option>
          {cities.map((city: City) => (
            <option key={city.id} value={city.id}>
              {getLocalizedText(city.name, lang)}
            </option>
          ))}
        </motion.select>
      </motion.div>

      {/* Error */}
      {(errorCities || errorResorts) && (
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <AnimatePresence>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <SkeletonCard />
                </motion.div>
              ))
            : resorts.map((resort) => (
                <motion.div
                  key={resort.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: resorts.indexOf(resort) * 0.1 }}
                >
                  <ResortCard resort={resort} lang={lang} />
                </motion.div>
              ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty */}
      {!isLoading && resorts.length === 0 && (
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
          className="flex justify-center items-center gap-1 mt-8 bg-white rounded-xl shadow-sm border border-[#4DC7E8]/20 p-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {renderPaginationButtons()}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Resort;