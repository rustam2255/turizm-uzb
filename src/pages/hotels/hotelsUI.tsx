
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

const HotelCard: React.FC<{
  name: string;
  id: number;
  desc: string;
  images: {
    id: number;
    image: string;
  }[];
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
        className="flex flex-row md:flex-col gap-4 md:gap-0 w-full items-start text-[#131313] border-b border-black/15 pb-4 md:pb-0 md:border-none"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      >
        <motion.div
          className="overflow-hidden w-full h-[115px] md:h-[220px] perspective-1000"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
          style={{ perspective: "1000px" }}
        >
          <motion.div
            className={`relative w-full h-full transition-transform duration-700 ease-in-out transform-style-preserve-3d ${
              isImageHovered ? "rotate-y-180" : "rotate-y-0"
            }`}
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
                className="md:w-full rounded-xl w-[174px] h-full object-cover"
                whileHover={{ scale: 1.1 }}
              />
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
                className="md:w-full rounded-xl w-[174px] h-full object-cover"
                whileHover={{ scale: 1.1 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className="text-[16px] md:text-[24px] mt-0 md:mt-4 mb-1.5 md:mb-1 line-clamp-1">
            {name}
          </h3>
          <motion.div
            className="flex items-center gap-1 mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {[...Array(fullStars)].map((_, i) => (
              <span key={i} className="text-yellow-500 text-sm md:text-base">★</span>
            ))}
            {hasHalfStar && <span className="text-yellow-500 text-sm md:text-base">☆</span>}
            {[...Array(maxStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
              <span key={i} className="text-gray-300 text-sm md:text-base">★</span>
            ))}
          </motion.div>
          <motion.p
            className="text-[14px] md:text-[15px] font-medium line-clamp-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {desc}
          </motion.p>
        </motion.div>
      </motion.div>
    </Link>
  );
};

const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      className="flex items-center text-[14px] font-medium md:text-[18px] gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="hover:underline text-black">{t("breadcrumb.home")}</Link>
      <span className="text-black">&gt;</span>
      <span className="text-blue-500">{t("breadcrumb.hotels")}</span>
    </motion.div>
  );
};

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
  }, [searchTerm, selectedCity, selectedRating, currentPage]);

  const getLocalizedText = (
    field: { uz?: string; en?: string; ru?: string } | undefined
  ): string => {
    if (!field) return "";
    return field[currentLang] || field.en || "";
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCityChange = (cityId: number | null) => {
    setSelectedCity(cityId);
    setCurrentPage(1);
  };

  const handleRatingChange = (rating: number | null) => {
    setSelectedRating(rating);
    setCurrentPage(1);
  };

  return (
    <motion.div
      className="max-w-[1800px] py-[20px] md:py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Breadcrumb />
      <motion.h1
        className="text-[20px] md:text-[32px] font-serif mt-2 md:mt-5 mb-[14px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {t("hotels.title")}
      </motion.h1>

      <motion.div
        className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div
          className={`${hotelsData && hotelsData.results.length === 0 ? "hidden" : "block"}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
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
          className="border border-gray-300 px-3 py-1 md:py-2 rounded w-full md:w-64 placeholder:text-sm placeholder:md:text-[16px]"
          value={searchTerm}
          onChange={handleSearch}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        />
        <motion.div
          className={`${hotelsData && hotelsData.results.length === 0 ? "hidden" : "block"}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <RatingSelect
            selectedRating={selectedRating}
            setSelectedRating={handleRatingChange}
          />
        </motion.div>
      </motion.div>

      {hotelsLoading && !hotelsData ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]"
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("hotels.errorLoading")}
        </motion.div>
      ) : hotelsData && hotelsData.results.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("hotels.noResult")}
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {hotelsData?.results.map((hotel, idx) => (
              <motion.div
                key={`${hotel.id}-${idx}`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
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

      <motion.div
        className="mt-8 flex justify-center gap-4 flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <motion.button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${page === currentPage ? "bg-[#DE5D26] text-white" : "bg-gray-200"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + (page - 1) * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
          >
            {page}
          </motion.button>
        ))}
      </motion.div>
      {citiesError && <div> error </div>}
    </motion.div>
  );
};

export default HotelUI;
