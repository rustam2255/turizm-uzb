import React from "react";
import { useTranslation } from "react-i18next";
import HotelCard from "@components/hotelCard";
import { useGetHotelsQuery } from "@/services/api";
import { Link } from "react-router-dom";

const HotelCardUI: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as "uz" | "ru" | "en";

  const { data: hotelsData, error, isLoading } = useGetHotelsQuery({ page: 1 });

  const getLocalizedText = (field?: { uz?: string; en?: string; ru?: string }): string => {
    if (!field) return "";
    return field[currentLang] || field.en || "";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        <span className="ml-3 text-sky-600 text-lg font-medium">Yuklanmoqda...</span>
      </div>
    );
  }

  if (error || !hotelsData) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-lg font-medium">Xatolik yuz berdi!</div>
          <p className="text-red-400 text-sm mt-2">Iltimos, qaytadan urinib ko'ring</p>
        </div>
      </div>
    );
  }

  const hotels = hotelsData.results.slice(0, 4);

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1900px] mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[rgba(77,199,232,255)] mb-4">
            {t("hotels.the_suite_hotels")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="snap-center">
              <HotelCard
                id={hotel.id}
                name={hotel.name}
                images={Array.isArray(hotel.images) ? hotel.images : hotel.images ? [hotel.images] : []}
                description={getLocalizedText(hotel.description)}
              />
            </div>
          ))}
        </div>
          {hotelsData  && (
          <div className="text-center mt-12">
            <Link
              to="/hotels"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold rounded-full hover:from-sky-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>{t('hotels.see')}</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelCardUI;