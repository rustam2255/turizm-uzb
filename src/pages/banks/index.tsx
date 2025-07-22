import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import { useGetBanksQuery, useGetCitiesHotelQuery } from "@/services/api";
import SkeletonCard from "@/components/ui/loaderSkleton/travelDestinationSkleton";
import IMAGE1 from '@/assets/images/banks.png';
import IMAGE from '@/assets/images/place3.png'
import { slugify } from "@/utils/slugify";

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
  images: string;
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
    bank.images && bank.images.length > 0 ? bank.images[0] : IMAGE;

  const secondImage =
    bank.images && bank.images.length > 1 ? bank.images[1] : IMAGE1;  
  return (
    <div
      className="flex flex-col p-3 hover:scale-105 transition h-full cursor-pointer"
      onClick={() => navigate(`/services/bank/${bank.id}-${slugify(bank.name)}`)}
    >
      <div className="relative h-48 overflow-hidden mb-3 rounded group" style={{ perspective: '1000px' }}>
        {/* Container for 3D flip effect */}
        <div className="w-full h-full transition-transform duration-700 ease-in-out transform-gpu group-hover:[transform:rotateY(180deg)]" style={{ transformStyle: 'preserve-3d' }}>

          {/* Front Image */}
          <img
            src={firstImage}
            alt={bank.name}
            className="w-full h-full object-cover absolute top-0 left-0"
            style={{ backfaceVisibility: 'hidden' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMAGE1;
            }}
          />

          {/* Back Image */}
          <img
            src={secondImage}
            alt={bank.name}
            className="w-full h-full object-cover absolute top-0 left-0"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMAGE;
            }}
          />

        </div>
      </div>
      <h2 className="text-lg font-semibold mb-2 line-clamp-2">{bank.name}</h2>
      <div className="flex items-center gap-1 text-gray-500 text-sm mt-auto pt-2 border-t border-gray-100">
        <MapPin size={16} className="mr-1" />
        <span className="truncate">{getLocalizedText({
          uz: bank.city.name_uz,
          ru: bank.city.name_ru,
          en: bank.city.name_en,
        },
          lang)}</span>
      </div>
    </div>
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
  console.log(bankData);
  

  const banks: Bank[] = bankData?.results || [];
  const totalPages = Math.ceil((bankData?.count || 0) / pageSize);
  const isLoading = loadingBanks || loadingCities;

  return (
    <div className="w-full px-4 md:px-[80px] pt-[79px] mt-8 mb-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2">
        <Link to="/" className="hover:underline text-black">
          {t("breadcrumb.home")}
        </Link>
        <span className="text-black">&gt;</span>
        <Link to="/services">
          <span className="text-blue-600">{t("services.title")}</span>
        </Link>
        <span className="text-black">&gt;</span>
        <span className="text-[#DE5D26]">{t("services.banks")}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-[32px] font-serif mb-5">{t("services.banks")}</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder={t("placeholder.bank")}
          className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/2"
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
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/3 text-sm"
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
        <div className="text-center text-red-500 my-8">
          {t("error.failed_to_load_data")}
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          : banks.map((bank) => (
            <BankCard key={bank.id} bank={bank} lang={lang} />
          ))}
      </div>

      {/* Empty */}
      {!isLoading && banks.length === 0 && (
        <p className="text-center text-gray-600 mt-10">
          {t("common.noData")}
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded transition-colors duration-200 ${currentPage === page
                ? "bg-[#DE5D26] text-white"
                : "bg-gray-100 hover:bg-gray-200"
                } text-sm sm:text-base`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Banks;
