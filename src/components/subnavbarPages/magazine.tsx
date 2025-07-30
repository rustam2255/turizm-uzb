import React, { useEffect, useState } from 'react';
import { useGetMagazinesQuery } from '@/services/api';
import { MagazineItem } from '@/interface';
import { Link } from 'react-router-dom';
import { slugify } from '@/utils/slugify';
import { useTranslation } from "react-i18next";

const MagazineHome: React.FC = () => {
  const { data: magazines = {}, isLoading, isError } = useGetMagazinesQuery();
  const [magazineItems, setMagazineItems] = useState<MagazineItem[]>([]);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0] as "uz" | "ru" | "en";
  useEffect(() => {
    if (magazines && !isLoading && !isError) {
      const year2025 = magazines['2025'] || [];
      const filteredItems = year2025.slice(0, 5);
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



  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1900px] mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[rgba(77,199,232,255)] mb-4">
            {t("magazine.title_home")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        {/* Magazines Carousel for Mobile, Grid for Desktop */}
        <div className="lg:grid lg:grid-cols-5 lg:gap-6 hidden">
          {magazineItems.map((item, index) => (
            <Link
              key={item.id}
              to={`/magazines/${item.id}-${slugify(item.title.en)}`}
              className="group block transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >

              <div className="flex flex-col items-center">
                <Link to={`/magazines/${item.id}-${slugify(item.title.en)}`}>
                  <img
                    src={item.card}
                    alt={`${item.title.en} magazine cover`}
                    className="w-full rounded-xl h-[300px] md:w-[200px] md:h-[250px] sm:w-[160px] sm:h-[200px] object-cover mb-4 transition-transform duration-200 hover:scale-105"

                  />
                </Link>
                <div className="text-center text-black font-normal leading-[100%]">
                  <p className="mb-1 text-[14px] md:text-[15px] sm:text-[13px]">{item.month}</p>
                  <p className="mb-1 text-[14px] md:text-[15px] sm:text-[13px]">
                    {getLocalizedText(item.title)}
                  </p>
                  <p className="text-[14px] md:text-[15px] sm:text-[13px]">{item.year}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-300">
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

            </Link>
          ))}
        </div>


        {magazineItems.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/magazines"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold rounded-full hover:from-sky-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>{t("magazine.allsee")}</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}

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