import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetCitiesHotelQuery, useGetToursQuery } from "@/services/api";
import TravelDestionationSkleton from "@/components/ui/loaderSkleton/travelDestinationSkleton";
import IMAGE from "@assets/images/samarkand-img.png";
import { slugify } from "@/utils/slugify";

const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;

type Lang = "uz" | "ru" | "en";

interface City {
  id: number;
  name: string | Record<Lang, string>;
}

const getLocalizedText = (
  text: string | Record<Lang, string> | undefined,
  lang: Lang
): string => {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[lang] || text.en || "";
};

// ==== TOUR CARD ====

const TourCard: React.FC<{
  id: number;
  name: string;
  city: string;
  image: {
    id: number;
    photo: string;
  }[];
}> = ({ id, name, city, image }) => {
  const [isImageHovered, setIsImageHovered] = useState(false);
  
  console.log("Image prop:", image);
  console.log("First image photo path:", image[0]?.photo);
  console.log("Resolved image URL:", `${MEDIA_URL}${image[0]?.photo}`);
  
  const navigate = useNavigate();

  // Birinchi va ikkinchi rasmlarni olish
  const firstImage = image && image.length > 0 
    ? `${MEDIA_URL}${image[0].photo}` 
    : IMAGE;
  
  const secondImage = image && image.length > 1 
    ? `${MEDIA_URL}${image[1].photo}` 
    : firstImage;

  return (
    <div
      onClick={() => navigate(`/services/tour/${id}-${slugify(name)}`)}
      className="flex flex-col cursor-pointer"
    >
      {/* 3D Flip Image Container */}
      <div 
        className="relative h-48 overflow-hidden mb-3 rounded-xl perspective-1000"
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
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = IMAGE;
              }}
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
              alt={`${name} - 2`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = IMAGE;
              }}
            />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-serif mb-2 line-clamp-2">{name}</h2>
      <div className="flex items-center text-gray-600 mb-2">
        <MapPin size={16} className="mr-1" />
        <span className="text-sm truncate">{city}</span>
      </div>
    </div>
  );
};
const TravelDestination: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language.split("-")[0] as Lang) || "en";

  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;

  const {
    data: cities = [],
    isLoading: loadingCities,
    isError: errorCities,
  } = useGetCitiesHotelQuery();

  const {
    data: tourData,
    isLoading: loadingTours,
    isError: errorTours,
  } = useGetToursQuery({
    city: selectedCity || undefined,
    search: searchQuery || undefined,
    page: currentPage,
  });
  

  const tours = tourData?.results || [];
  useEffect(() => {
  console.log("Tour object:", tours);
}, [tours]);
  const totalPages = Math.ceil((tourData?.count || 0) / pageSize);
  const isLoading = loadingTours || loadingCities;

  return (
    <div className="w-full px-4 md:px-[80px] pt-[79px] mt-8 mb-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2">
        <Link to="/" className="hover:underline text-black">{t("breadcrumb.home")}</Link>
        <span className="text-black">&gt;</span>
        <Link to="/services" className="hover:underline text-blue-600">{t("services.title")}</Link>
        <span className="text-black">&gt;</span>
        <Link to="/services/tours" className="hover:underline text-sky-200">{t("services.tour-firm")}</Link>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-[32px] font-serif mb-5">{t("services.tour-firm")}</h1>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder={t("placeholder.travel")}
          className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          onChange={(e) => setSelectedCity(Number(e.target.value) || null)}
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


      {(errorCities || errorTours) && (
        <div className="text-center text-red-500 my-8">
          {t("error.failed_to_load_data")}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
            <TravelDestionationSkleton key={index} />
          ))
          : tours.map((tour) => (
            <TourCard
              key={tour.id}
              id={tour.id}
              name={tour.name}
              city={getLocalizedText(
                {
                  uz: tour.city.name_uz,
                  en: tour.city.name_en,
                  ru: tour.city.name_ru,
                },
                lang
              )}
              image= {tour.image}
            />
          ))}
      </div>


      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded transition-colors duration-200 ${currentPage === page
                ? "bg-blue-500 text-white"
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

export default TravelDestination;
