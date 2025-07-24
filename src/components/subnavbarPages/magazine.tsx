import React, { useEffect, useState } from 'react';
import { useGetMagazinesQuery } from '@/services/api';
import { MagazineItem } from '@/interface';
import { Link } from 'react-router-dom';
import { slugify } from '@/utils/slugify';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTranslation } from "react-i18next";
const MagazineHome: React.FC = () => {
  const { data: magazines = {}, isLoading, isError } = useGetMagazinesQuery();
  const [magazineItems, setMagazineItems] = useState<MagazineItem[]>([]);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0] as "uz" | "ru" | "en";
  useEffect(() => {
    if (magazines && !isLoading && !isError) {
      const year2025 = magazines['2025'] || [];
      const filteredItems = year2025.slice(0, 4);
      setMagazineItems(filteredItems);
    }
  }, [magazines, isLoading, isError]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-blue-600 text-lg font-medium">Yuklanmoqda...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-lg font-medium">Xatolik yuz berdi!</div>
          <p className="text-red-400 text-sm mt-2">Iltimos, qaytadan urinib ko'ring</p>
        </div>
      </div>
    );
  }
  const getLocalizedText = (
    field: { uz?: string; en?: string; ru?: string } | undefined
  ): string => {
    if (!field) return "";
    return field[currentLang] || field.en || "";
  };
  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 640, // Mobil uchun
        settings: {
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 1024, // Tablet uchun
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 1280, // Desktop uchun
        settings: {
          slidesToShow: 4,
        }
      }
    ]
  };

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1900px] mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t("magazine.title_home")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        {/* Magazines Carousel for Mobile, Grid for Desktop */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-6 hidden">
          {magazineItems.map((item, index) => (
            <Link
              key={item.id}
              to={`/magazines/${item.id}-${slugify(item.title.en)}`}
              className="group block transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-blue-200">
                <div className="relative overflow-hidden">
                  <img
                    src={item.card}
                    alt={item.title.en}
                    className="w-full h-48 sm:h-52 lg:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-blue-600 shadow-md">
                    {item.year} - {item.month}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {getLocalizedText(item.title)}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {getLocalizedText(item.description).slice(0,100)}...
                  </p>
                  <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-300">
                    <span>{t("common.details")}</span>
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
          ))}
        </div>

        {/* Carousel for Mobile */}
        <div className="lg:hidden block">
          <Slider {...sliderSettings}>
            {magazineItems.map((item, index) => (
              <Link
                key={item.id}
                to={`/magazines/${item.id}-${slugify(item.title.en)}`}
                className="group block transform transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-blue-200 mx-2">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.card}
                      alt={item.title.en}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-blue-600 shadow-md">
                      {item.year} - {item.month}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {getLocalizedText(item.title)}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {getLocalizedText(item.description).slice(0,50)}...
                    </p>
                    <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-300">
                      <span>{t("common.details")}</span>
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
            ))}
          </Slider>
        </div>

        {/* Empty State */}
        {magazineItems.length === 0 && !isLoading && !isError && (
          <div className="text-center py-20">
            <div className="text-gray-400 text-lg">Hozircha jurnallar mavjud emas</div>
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

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
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

export default MagazineHome;