import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";

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
  city: MultilangText
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

const getLocalizedTextDescr = (
  text: MultilangText | undefined,
  lang: Lang
): string => {
  if (!text) return "";
  return text[lang] || text.en || "";
};

const getLocalizedText = (
  text: string | Record<Lang, string> | undefined,
  lang: Lang
): string => {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[lang] || text.en || "";
};

const ResortCard: React.FC<{ resort: Resort; lang: Lang }> = ({ resort, lang }) => {
  console.log(resort.images);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const navigate = useNavigate();

  // Birinchi va ikkinchi rasmlarni olish
  const firstImage = resort.images && resort.images.length > 0 
    ? `${MEDIA_URL}${resort.images[0].photo}` 
    : FallbackImage;
  
  const secondImage = resort.images && resort.images.length > 1 
    ? `${MEDIA_URL}${resort.images[1].photo}` 
    : firstImage;

  return (
    <div className="flex flex-col p-3 hover:scale-105 hover:cursor-pointer transition h-full" 
         onClick={() => navigate(`/services/resort/${resort.id}-${resort.name}`)}>
      
      <div 
        className="relative h-48 overflow-hidden mb-3 rounded group perspective-1000"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        style={{ perspective: '1000px' }}
      >
        {/* 3D flip container */}
        <div 
          className={`relative w-full h-full transition-transform duration-700 ease-in-out transform-style-preserve-3d ${
            isImageHovered ? 'rotate-y-180' : 'rotate-y-0'
          }`}
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isImageHovered ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front face - Birinchi rasm */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <img
              src={firstImage}
              alt={resort.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Back face - Ikkinchi rasm */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <img
              src={secondImage}
              alt={`${resort.name} - 2`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-2 line-clamp-2">{resort.name}</h2>

      {/* content grow qiladigan joy */}
      <p className="text-gray-600 text-sm mb-2 line-clamp-3 flex-grow">
        {getLocalizedTextDescr(resort.description, lang)}
      </p>

      {/* har doim pastda qoladigan footer */}
      <div className="flex justify-between items-center text-gray-500 text-sm mt-auto pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <MapPin size={16} className="mr-1" />
          <span className="truncate">{getLocalizedText(resort.city as Record<Lang, string>, lang)}</span>
        </div>
        <span className="truncate">{resort.type}</span>
      </div>
    </div>
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


  return (
    <div className="w-full px-4 md:px-[80px] pt-[79px] mt-8 mb-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2">
        <Link to="/" className="hover:underline text-black">
          {t("breadcrumb.home")}
        </Link>
        <span className="text-black">&gt;</span>
        <Link to={'/services'}>
          <span className="text-blue-600">{t("services.title")}</span>
        </Link>
        <span className="text-black">&gt;</span>
        <span className="text-[#DE5D26]">{t("services.resort")}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-[32px] font-serif mb-5">{t("services.resort")}</h1>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder={t("placeholder.resort")}
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
          {cities.map((city: City) => (
            <option key={city.id} value={city.id}>
              {getLocalizedText(city.name, lang)}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {(errorCities || errorResorts) && (
        <div className="text-center text-red-500 my-8">
          {t("error.failed_to_load_data")}
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : resorts.map((resort) => (
            <ResortCard key={resort.id} resort={resort} lang={lang} />
          ))}
      </div>

      {/* Empty */}
      {!isLoading && resorts.length === 0 && (
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

export default Resort;
