import React, {  useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {  AnimatePresence } from "framer-motion";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetCitiesHotelQuery, useGetToursQuery } from "@/services/api";
import TravelDestionationSkleton from "@/components/ui/loaderSkleton/travelDestinationSkleton";
import IMAGE from "@assets/images/samarkand-img.png";
import { slugify } from "@/utils/slugify";
import { Helmet } from "react-helmet-async";
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
  const navigate = useNavigate();

  const firstImage = image && image.length > 0 ? `${MEDIA_URL}${image[0].photo}` : IMAGE;
  const secondImage = image && image.length > 1 ? `${MEDIA_URL}${image[1].photo}` : firstImage;

  return (
    <div
      onClick={() => navigate(`/services/tour/${id}-${slugify(name)}`)}
      className="flex flex-col w-full h-[300px] md:h-[300px] bg-white border  overflow-hidden cursor-pointer"
    >
      {/* 3D Flip Image Container */}
      <div
        className="relative h-[160px] md:h-[200px]  overflow-hidden"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative w-full h-full transition-transform duration-700 ease-in-out transform-style-preserve-3d"
          style={{
            transformStyle: "preserve-3d",
            transform: isImageHovered ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <img
              src={firstImage}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => (e.target as HTMLImageElement).src = IMAGE}
            />
            <div className="absolute inset-0 bg-[#4DC7E8]/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <img
              src={secondImage}
              alt={`${name} - 2`}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => (e.target as HTMLImageElement).src = IMAGE}
            />
            <div className="absolute inset-0 bg-[#4DC7E8]/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </div>

      <div
        className="flex flex-col flex-grow p-4"
      >
        <h2
          className="text-[16px] md:text-[20px] font-semibold mb-2 line-clamp-1 text-[#131313]"
        >
          {name}
        </h2>
        <div
          className="flex items-center text-gray-500 text-[14px] md:text-[15px] mt-auto"
        >
          <MapPin size={16} className="text-rgba(25,110,150,255) mr-1" />
          <span className="truncate">{city}</span>
        </div>
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
 
  const totalPages = Math.ceil((tourData?.count || 0) / pageSize);
  const isLoading = loadingTours || loadingCities;

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

  return (
    <div
      className="max-w-[1600px] mx-auto px-4 md:px-[80px] py-6 md:py-10 bg-gradient-to-b from-white to-[#4DC7E8]/5 min-h-screen"
    >
      <Helmet>
        <title>{t("services.tour-firm")} | Uzbekistan Travel Tours</title>
        <meta name="description" content={t("services.tour-firm_description")} />
        <meta name="keywords" content={`tour, travel, Uzbekistan, ${t("services.tour-firm")}`} />
        <link rel="canonical" href={window.location.href} />
        {/* Open Graph */}
        <meta property="og:title" content={`${t("services.tour-firm")} | Uzbekistan Travel Tours`} />
        <meta property="og:description" content={t("services.tour-firm_description")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={IMAGE} />
      </Helmet>
      {/* Breadcrumb */}
      <div
        className="flex items-center text-[14px] md:text-[16px] font-medium gap-2 text-[#131313]"
      >
        <Link to="/" className=" transition-colors duration-200">
          {t("breadcrumb.home")}
        </Link>
        <span className="">&gt;</span>
        <Link
          to="/services"
          className=" transition-colors duration-200"
        >
          {t("services.title")}
        </Link>
        <span className="">&gt;</span>
        <span className="text-sky-900 font-semibold">{t("services.tour-firm")}</span>
      </div>

      {/* Title */}
      <p
        className="text-[20px] md:text-[30px] font-bold mt-3 md:mt-6 mb-4 text-sky-900"
      >
        {t("services.tour-firm")}
      </p>

      {/* Filter */}
      <div
        className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6"
      >
        <input
          type="text"
          placeholder={t("placeholder.travel")}
          className="w-full sm:w-1/2 px-4 py-2 font-semibold  border  text-sm md:text-base placeholder:text-sky-900 bg-white  transition-all duration-300"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          onChange={(e) => {
            setSelectedCity(Number(e.target.value) || null);
            setCurrentPage(1);
          }}
          value={selectedCity || ""}
          className="w-full sm:w-1/3 px-4 py-2  text-sky-900 border text-sm md:text-base bg-white transition-all duration-300"
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
      {(errorCities || errorTours) && (
        <div
          className="text-center text-red-500 text-[16px] md:text-[18px] font-medium my-8"
        >
          {t("error.failed_to_load_data")}
        </div>
      )}

      {/* Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
              >
                <TravelDestionationSkleton />
              </div>
            ))
            : tours.map((tour) => (
              <div
                key={tour.id}
              >
                <TourCard
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
                  image={tour.image}
                />
              </div>
            ))}
        </AnimatePresence>
      </div>

      {/* Empty */}
      {!isLoading && tours.length === 0 && (
        <p
          className="text-center text-gray-600 text-[16px] md:text-[18px] font-medium mt-10"
        >
          {t("common.noData")}
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex justify-center items-center gap-1 mt-8 bg-white    border border-[#4DC7E8]/20 p-2"
        >
          {renderPaginationButtons()}
        </div>
      )}

    </div>
  );
};

export default TravelDestination;