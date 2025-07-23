import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CityFilter from "@/components/ui/CityFilter";
import RatingSelect from "@/components/ui/ratingSelect";
import HotelCardSkeleton from "@/components/ui/loaderSkleton/homeSkleton";
import { useTranslation } from "react-i18next";
import { useGetHotelsQuery, useGetCitiesHotelQuery } from "@/services/api";
import { slugify } from "@/utils/slugify";
import image from '@assets/images/place3.png'



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
  const parsedRating = parseFloat(rating);
  const fullStars = Math.floor(parsedRating);
  const hasHalfStar = parsedRating - fullStars >= 0.5;
  const maxStars = 5;



  return (
    <Link to={`/hotels/${id}-${slugify(name)}`}>
      <div className="flex flex-row md:flex-col gap-4 md:gap-0 w-full items-start text-[#131313] border-b border-black/15 pb-4 md:pb-0 md:border-none">
        <div className="overflow-hidden w-full h-[115px] md:h-[220px]">
          <img
            src={images && images.length > 0 && images[0]?.image ? images[0].image : image}
            alt={name}
            className="md:w-full rounded-xl w-[174px] h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="w-full">
          <h3 className="text-[16px] md:text-[24px] mt-0 md:mt-4 mb-1.5 md:mb-1 line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-1 mb-1">
            {[...Array(fullStars)].map((_, i) => (
              <span key={i} className="text-yellow-500 text-sm md:text-base">★</span>
            ))}
            {hasHalfStar && (
              <span className="text-yellow-500 text-sm md:text-base">☆</span>
            )}
            {[...Array(maxStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
              <span key={i} className="text-gray-300 text-sm md:text-base">★</span>
            ))}
          </div>
          <p className="text-[14px] md:text-[15px] font-medium line-clamp-3">
            {desc}
          </p>
        </div>
      </div>
    </Link>
  );
};

const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center text-[14px] font-medium md:text-[18px] gap-2">
      <Link to="/" className="hover:underline text-black">{t("breadcrumb.home")}</Link>
      <span className="text-black">&gt;</span>
      <span className="text-[#DE5D26]">{t("breadcrumb.hotels")}</span>
    </div>
  );
}

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
  }, [searchTerm, selectedCity, selectedRating,currentPage]);

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
    <div className="max-w-[1800px] py-[20px] md:py-8">
      <Breadcrumb />
      <h1 className="text-[20px] md:text-[32px] font-serif mt-2 md:mt-5 mb-[14px]">
        {t("hotels.title")}
      </h1>

      <div className="flex  flex-row md:flex-row md:items-center gap-1 md:gap-4 mb-4">
        <div className={`${hotelsData && hotelsData.results.length === 0 ? "hidden" : "block"}`}>
          <CityFilter
            cities={cities}
            selectedCity={selectedCity}
            setSelectedCity={handleCityChange}
            fetchHotels={() => refetchHotels()}
          />
        </div>
        <input
          type="text"
          placeholder={t("hotels.searchPlaceholder")}
          className="border border-gray-300 px-3 py-1 md:py-2  rounded w-full md:w-64 placeholder:text-sm  placeholder:md:text-[16px]"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className={`${hotelsData && hotelsData.results.length === 0 ? "hidden" : "block"}`}>

          <RatingSelect
            selectedRating={selectedRating}
            setSelectedRating={handleRatingChange}
          />
        </div>
      </div>

      {hotelsLoading && !hotelsData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]">
          {[...Array(8)].map((_, index) => (
            <HotelCardSkeleton key={index} />
          ))}
        </div>
      ) : hotelsError ? (
        <div>{t("hotels.errorLoading")}</div>
      ) : hotelsData && hotelsData.results.length === 0 ? (
        <div>{t("hotels.noResult")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]">
          {hotelsData?.results.map((hotel, idx) => (
            <HotelCard
              key={`${hotel.id}-${idx}`}
              id={hotel.id}
              desc={getLocalizedText(hotel.description)}
              images={Array.isArray(hotel.images) ? hotel.images : [hotel.images]}
              rating={hotel.rating || "0"}
              name={(hotel.name)}
            />
          ))}

        </div>
      )}


      <div className="mt-8 flex justify-center gap-4 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${page === currentPage ? "bg-[#DE5D26] text-white" : "bg-gray-200"
              }`}
          >
            {page}
          </button>
        ))}
      </div>
      {citiesError && <div> error </div>}
    </div>
  );
};

export default HotelUI;
