import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAirplaneQuery, useGetCitiesHotelQuery } from "@/services/api";
import SkeletonCard from "@/components/ui/loaderSkleton/travelDestinationSkleton";
import IMAGE1 from "@/assets/images/banks.png";
import IMAGE from "@/assets/images/place3.png";
import { slugify } from "@/utils/slugify";
import { Helmet } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";

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
    bank.images && bank.images.length > 0 ? `${bank.images[0].photo}` : IMAGE;
  const secondImage =
    bank.images && bank.images.length > 1 ? `${bank.images[1].photo}` : IMAGE1;

  return (
    <div
      className="flex flex-col w-full h-[300px] md:h-[300px] bg-white  transition-shadow duration-300 border  overflow-hidden cursor-pointer"
      onClick={() => navigate(`/services/airplane/${bank.id}-${slugify(bank.name)}`)}
    >
      <div
        className="relative h-[160px] md:h-[200px] overflow-hidden mb-3  group"
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
            className="w-full h-full object-cover absolute top-0 left-0"
            style={{ backfaceVisibility: "hidden" }}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMAGE1;
            }}
          />
          <div className="absolute inset-0 bg-[#4DC7E8]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 " />

          {/* Back Image */}
          <img
            src={secondImage}
            alt={bank.name}
            className="w-full h-full object-cover absolute top-0 left-0"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMAGE;
            }}
          />
        </div>
      </div>
      <div
        className="flex flex-col flex-grow p-4"
      >
        <h2
          className="text-[16px] md:text-[20px] font-semibold mb-2 line-clamp-2 text-[#131313]"
        >
          {bank.name}
        </h2>
        <div
          className="flex items-center gap-1 text-gray-500 text-[14px] md:text-[15px] mt-auto pt-2 border-t border-[#4DC7E8]/10"
        >
          <MapPin size={16} className="text-sky-900  mr-1" />
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
        </div>
      </div>
    </div>
  );
};

const Airplane: React.FC = () => {
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
  } = useGetAirplaneQuery({
    page: currentPage,
    search: searchQuery || undefined,
    city: selectedCity || undefined,
  });

  const banks: Bank[] = bankData?.results || [];
  const totalPages = Math.ceil((bankData?.count || 0) / pageSize);
  const isLoading = loadingBanks || loadingCities;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 3;

    // Previous buttons
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
          className={`px-3 py-2 rounded-lg transition-colors duration-200 ${currentPage === 1
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
          className={`px-3 py-2 rounded-lg transition-colors duration-200 ${i === currentPage
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
          className={`px-3 py-2 rounded-lg transition-colors duration-200 ${currentPage === totalPages
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

  const seoDescription = banks.length
    ? `${t("services.airplane")} in ${selectedCity ? cities.find(c => String(c.id) === selectedCity)?.name : t("common.allCities")}`
    : t("common.noData");
  const seoKeywords = banks.map(b => b.name).join(", ");
  return (
    <div
      className="max-w-[1600px] md:px-[80px] mx-auto px-4  py-6 md:py-10 bg-gradient-to-b from-white to-[#4DC7E8]/5 min-h-screen"
    >
      <Helmet>
        <title>{t("services.airplane")} - MyCity</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      {/* Breadcrumb */}
      <div
        className="flex items-center text-[14px] md:text-[16px] font-medium gap-2 text-[#131313]"
      >
        <Link to="/" className=" transition-colors duration-200">
          {t("breadcrumb.home")}
        </Link>
        <span className="">&gt;</span>
        <Link to="/services" className=" transition-colors duration-200">
          <span>{t("services.title")}</span>
        </Link>
        <span className="">&gt;</span>
        <span className="text-sky-900 font-semibold">{t("services.airplane")}</span>
      </div>

      {/* Title */}
      <p
        className="text-[20px] md:text-[30px] font-bold mt-3 md:mt-6 mb-4 text-sky-900"
      >
        {t("services.airplane")}
      </p>

      {/* Filters */}
      <div
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <input
          type="text"
          placeholder={t("placeholder.airplane")}
          className="w-full sm:w-1/2 px-4 py-2  border font-semibold text-sm md:text-base placeholder:text-sky-900 bg-white transition-all duration-300"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          onChange={(e) => {
            setSelectedCity(String(e.target.value) || null);
            setCurrentPage(1);
          }}
          value={selectedCity || ""}
          className="w-full sm:w-1/3 px-4 py-2 text-sky-900  border  text-sm md:text-base bg-white  transition-all duration-300"
        >
          <option value="">{t("travel.select_city")}</option>
          {cities.map((city: BankCity) => (
            <option key={city.id} value={city.id}>
              {getLocalizedText(city.name, lang)}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {(errorBanks || errorCities) && (
        <div
          className="text-center text-red-500 text-[16px] md:text-[18px] font-medium my-8"
        >
          {t("error.failed_to_load_data")}
        </div>
      )}

      {/* Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
              >
                <SkeletonCard />
              </div>
            ))
            : banks.map((bank) => (
              <div
                key={bank.id}
              >
                <BankCard bank={bank} lang={lang} />
              </div>
            ))}
        </AnimatePresence>
      </div>

      {/* Empty */}
      {!isLoading && banks.length === 0 && (
        <p
          className="text-center text-gray-600 text-[16px] md:text-[18px] font-medium mt-10"
        >
          {t("common.noData")}
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex justify-center items-center gap-1 mt-8 bg-white rounded-xl shadow-sm border border-[#4DC7E8]/20 p-2"
        >
          {renderPaginationButtons()}
        </div>
      )}
    </div>
  );
};

export default Airplane;