import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CityFilter from "@/components/ui/CityFilter";
import RatingSelect from "@/components/ui/ratingSelect";
import HotelCardSkeleton from "@/components/ui/loaderSkleton/homeSkleton";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useGetHotelsQuery, useGetCitiesHotelQuery } from "@/services/api";
import { slugify } from "@/utils/slugify";
import image from "@assets/images/place3.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
// HotelCard Component (unchanged)
const HotelCard: React.FC<{
  name: string;
  id: number;
  desc: string;
  images: { id: number; image: string }[];
  rating: string;

}> = ({ id, images, rating, name, desc }) => {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const parsedRating = parseFloat(rating);
  const fullStars = Math.floor(parsedRating);
  const hasHalfStar = parsedRating - fullStars >= 0.5;
  const maxStars = 5;

  const firstImage = images && images.length > 0 && images[0]?.image ? images[0].image : image;
  const secondImage = images && images.length > 1 && images[1]?.image ? images[1].image : firstImage;

  return (
    <Link to={`/hotels/${id}-${slugify(name)}`}>
      <motion.div
        className="flex flex-col w-full h-[360px] md:h-[420px] text-[#131313] bg-white rounded-xl shadow-md shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40 transition-shadow duration-300 border border-[#4DC7E8]/10 overflow-hidden"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.03 }}
      >
        <motion.div
          className="relative w-full h-[160px] md:h-[200px] rounded-t-xl overflow-hidden"
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
                alt={name}
                className="w-full h-full object-cover rounded-t-xl"
                onError={(e) => (e.currentTarget.src = image)}
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
                alt={`${name} - 2`}
                className="w-full h-full object-cover rounded-t-xl"
                onError={(e) => (e.currentTarget.src = image)}
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
          <h3 className="text-[16px] md:text-[20px] font-semibold mb-2 line-clamp-1 text-[#131313]">
            {name}
          </h3>
          <motion.div
            className="flex items-center gap-1 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {[...Array(fullStars)].map((_, i) => (
              <span key={i} className="text-yellow-300 text-sm md:text-base">★</span>
            ))}
            {hasHalfStar && <span className="text-yellow-300 text-sm md:text-base">☆</span>}
            {[...Array(maxStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
              <span key={i} className="text-gray-300 text-sm md:text-base">★</span>
            ))}
          </motion.div>
          <motion.p
            className="text-[14px] md:text-[15px] font-medium text-gray-600 line-clamp-3 flex-grow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            {desc}
          </motion.p>
        </motion.div>
      </motion.div>
    </Link>
  );
};

// Breadcrumb Component (unchanged)
const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      className="flex items-center text-[14px] md:text-[16px] font-medium gap-2 text-[#131313]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to="/" className="transition-colors duration-200">
        {t("breadcrumb.home")}
      </Link>
      <span className="text-black">&gt;</span>
      <span className="text-sky-900 font-semibold">{t("breadcrumb.hotels")}</span>
    </motion.div>
  );
};

// HotelUI Component
const HotelUI: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0] as "en" | "uz" | "ru";
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const { data: cities = [], error: citiesError } = useGetCitiesHotelQuery();
  const {
    data: hotelsData,
    error: hotelsError,
    isLoading: hotelsLoading,
    refetch: refetchHotels,
  } = useGetHotelsQuery({
    page: currentPage,
    city: selectedCity !== null ? String(selectedCity) : undefined,
    search: searchTerm.trim() || undefined,
    rating: selectedRating || undefined,
  });

  const totalPages = hotelsData ? Math.ceil(hotelsData.count / 12) : 1;

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      refetchHotels();
    }, 300);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchTerm, selectedCity, selectedRating, currentPage, refetchHotels]);

  const getLocalizedText = (
    field: { uz?: string; en?: string; ru?: string } | undefined
  ): string => {
    if (!field) return "";
    return field[currentLang] || field.en || "";
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCityChange = (cityId: number | null) => {
    setSelectedCity(cityId);
    setCurrentPage(1);
  };

  const handleRatingChange = (rating: number | null) => {
    setSelectedRating(rating);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 3;

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

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

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

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="end-ellipsis" className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      }
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
  const seoTitle = selectedCity
    ? `${t("hotels.title")} in ${cities.find(c => c.id === selectedCity)?.name || ""}`
    : t("hotels.title");
  const seoDescription = `Explore hotels${selectedCity ? ` in ${cities.find(c => c.id === selectedCity)?.name || ""}` : ""}.`;
  const imageArray = Array.isArray(hotelsData?.results?.[0]?.images)
  ? hotelsData.results[0].images
  : hotelsData?.results?.[0]?.images
  ? [hotelsData.results[0].images]
  : [];
  
const seoImage = imageArray[0]?.image || image; 

  return (
    <motion.div
      className="max-w-[1600px] mx-auto py-6 md:py-10 px-4 bg-gradient-to-b from-white to-[#4DC7E8]/5 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={seoImage} />
        <meta property="og:locale" content={currentLang} />
      </Helmet>
      <Breadcrumb />
      <motion.p
        className="text-[20px] md:text-[30px] font-bold mt-3 md:mt-6 mb-4 text-sky-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {t("hotels.title")}
      </motion.p>

      <motion.div
        className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-6 relative z-[10000]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <motion.div
          className={`${hotelsData && hotelsData.results.length === 0 ? "hidden" : "block"} w-full md:w-auto relative z-[10001]`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <CityFilter
            cities={cities}
            selectedCity={selectedCity}
            setSelectedCity={handleCityChange}
            fetchHotels={() => refetchHotels()}

          />
        </motion.div>
        <motion.input
          type="text"
          placeholder={t("hotels.searchPlaceholder")}
          className="w-full md:w-64 px-4 py-2 rounded-lg border font-semibold border-[#4DC7E8]/50 focus:border-[#4DC7E8] focus:ring-2 focus:ring-[#4DC7E8]/30 text-sm md:text-base placeholder:text-[rgba(25,110,150,255)] bg-white shadow-sm hover:shadow-[#4DC7E8]/30 transition-all duration-300"
          value={searchTerm}
          onChange={handleSearch}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        />
        <motion.div
          className={`${hotelsData && hotelsData.results.length === 0 ? "hidden" : "block"} w-full md:w-auto relative z-[10001]`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <RatingSelect
            selectedRating={selectedRating}
            setSelectedRating={handleRatingChange}
            className="z-[10002]" // Ensure dropdown menu has higher z-index
          />
        </motion.div>
      </motion.div>

      {hotelsLoading && !hotelsData ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(8)].map((_, index) => (
            <HotelCardSkeleton key={index} />
          ))}
        </motion.div>
      ) : hotelsError ? (
        <motion.div
          className="text-red-500 text-center text-[16px] md:text-[18px] font-medium relative z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("hotels.errorLoading")}
        </motion.div>
      ) : hotelsData && hotelsData.results.length === 0 ? (
        <motion.div
          className="text-gray-600 text-center text-[16px] md:text-[18px] font-medium relative z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("hotels.noResult")}
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {hotelsData?.results.map((hotel, idx) => (
              <motion.div
                key={`${hotel.id}-${idx}`}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <HotelCard
                  id={hotel.id}
                  desc={getLocalizedText(hotel.description)}
                  images={Array.isArray(hotel.images) ? hotel.images : [hotel.images]}
                  rating={hotel.rating || "0"}
                  name={hotel.name}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {totalPages > 1 && (
        <motion.div
          className="mt-8 flex justify-center items-center gap-1 bg-white rounded-xl shadow-sm border border-[#4DC7E8]/20 p-2 relative z-[1000]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {renderPaginationButtons()}
        </motion.div>
      )}
      {citiesError && (
        <motion.div
          className="text-red-500 text-center text-[16px] md:text-[18px] font-medium mt-4 relative z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("hotels.errorLoadingCities")}
        </motion.div>
      )}
    </motion.div>
  );
};

export default HotelUI;