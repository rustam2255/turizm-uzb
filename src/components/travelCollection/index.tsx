import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useGetToursQuery } from "@/services/api";
import { slugify } from "@/utils/slugify";
import IMAGE from "@assets/images/samarkand-img.png";


const TravelCollection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split("-")[0] as "uz" | "ru" | "en";


  const { data, error, isLoading } = useGetToursQuery({ page: 1 });
  const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;

  // Tiplar
  interface City {
    name_en: string;
    name_ru: string;
    name_uz: string;
  }



  // Tilga mos shahar nomini olish
  const getLocalizedCityName = (city: City, lang: "uz" | "ru" | "en"): string => {
    return city?.[`name_${lang}`] || city?.name_en || "";
  };



  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-blue-600 text-lg font-medium">Yuklanmoqda...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-lg font-medium">Xatolik yuz berdi!</div>
          <p className="text-red-400 text-sm mt-2">Iltimos, qaytadan urinib ko'ring</p>
        </div>
      </div>
    );
  }

  const tours = data?.results?.slice(0, 3) || [];


  return (
    <div className="py-12 sm:py-16 lg:py-20" id="destination">
      <div className="max-w-[1900px] mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t("travel.travel_collections")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        {/* Tours Grid for Desktop, Carousel for Mobile */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 hidden ">
          {tours.map((destination, index) => {
            const imageUrl = destination.image?.[0]?.photo
              ? `${MEDIA_URL}${destination.image[0].photo}`
              : IMAGE;

            return (
              <Link
                key={destination.id}
                to={`/services/tour/${destination.id}-${slugify(destination.name)}`}
                className="group block transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-blue-200">
                  <div className="relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={destination.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = IMAGE;
                      }}
                      className="w-full h-48 sm:h-52 lg:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {destination.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <svg
                        className="w-4 h-4 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="truncate">
                        {getLocalizedCityName(destination.city, lang)}
                      </span>
                    </div>
                    <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-300">
                      <span>Batafsil ma'lumot</span>
                      <svg
                        className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>


        {tours && (
          <div className="text-center mt-12">
            <Link
              to="/services/banks"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold rounded-full hover:from-sky-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>{t("travel.see")}</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>


      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .group {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .slick-slide {
            padding: 0 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default TravelCollection;