import React, { useEffect, useState } from 'react';
import { useGetResortsQuery } from '@/services/api';
import { Resort } from '@/interface';
import { Link } from 'react-router-dom';
import { slugify } from '@/utils/slugify';
import { getLocalizedTextDescr } from '@/utils/getLocalized';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import { useTranslation } from "react-i18next";
import 'slick-carousel/slick/slick-theme.css';
const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;


const ResortHome: React.FC = () => {
  const { data: resorts = { results: [] }, isLoading, isError } = useGetResortsQuery({});
  const [resortItems, setResortItems] = useState<Resort[]>([]);
  const { t, i18n } = useTranslation();
  type Lang = "uz" | "ru" | "en";
  const lang = (i18n.language.split("-")[0] as Lang) || "en";
  useEffect(() => {
    if (resorts && !isLoading && !isError) {
      setResortItems(resorts.results.slice(0, 4));
    }
  }, [resorts, isLoading, isError]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        <span className="ml-3 text-sky-600 text-lg font-medium">Yuklanmoqda...</span>
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

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sky-900 mb-4">
            {t("resort.title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>
        <div className="lg:grid lg:grid-cols-4 lg:gap-6 hidden ">
          {resortItems.map((item, index) => (
            <Link
              key={item.id}
              to={`/services/resort/${item.id}-${slugify(item.name)}`}
              className="group block transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-sky-100 group-hover:border-sky-300">
                <div className="relative overflow-hidden">
                  {item.images[0]?.photo ? (
                    <img
                      src={`${MEDIA_URL}${item.images[0].photo}`}
                      alt={item.name}
                      className="w-full h-48 sm:h-52 lg:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-48 sm:h-52 lg:h-48 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-sky-600/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md">
                    {item.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-sky-900 mb-3 line-clamp-2 group-hover:text-sky-700 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{typeof item.city === 'object' ? item.city[lang] || item.city.en || item.city.uz : item.city}</span>
                  </div>
                  <p className="text-gray-700 hover:text-sky-700 text-sm leading-relaxed line-clamp-3 mb-4">
                    {getLocalizedTextDescr(item.description, lang)?.substring(0, 100) || 'Tavsif mavjud emas'}...
                  </p>
                  <div className="flex items-center text-sky-600 font-medium text-sm group-hover:text-sky-700 transition-colors duration-300">
                    <span>{t("common.details")}</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Carousel for mobile */}
        <div className="lg:hidden block">
          <Slider {...sliderSettings}>
            {resortItems.map((item) => (
              <Link
                key={item.id}
                to={`/services/resort/${item.id}-${slugify(item.name)}`}
                className="group block transform transition-all duration-300 hover:scale-105"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-sky-100 group-hover:border-sky-300">
                  <div className="relative overflow-hidden">
                    {item.images[0]?.photo ? (
                      <img
                        src={`${MEDIA_URL}${item.images[0].photo}`}
                        alt={item.name}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
                        <svg className="w-16 h-16 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-sky-600/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md">
                      {item.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-sky-900 mb-3 line-clamp-2 group-hover:text-sky-700 transition-colors duration-300">
                      {item.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{typeof item.city === 'object' ? item.city[lang] || item.city.en || item.city.uz : item.city}</span>
                    </div>
                    <p className="text-gray-700 hover:text-sky-700 text-sm leading-relaxed line-clamp-3 mb-4">
                      {getLocalizedTextDescr(item.description, lang)?.substring(0, 100) || 'Tavsif mavjud emas'}...
                    </p>
                    <div className="flex items-center text-sky-600 font-medium text-sm group-hover:text-sky-700 transition-colors duration-300">
                      <span>{t("common.detail")}</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        </div>

        {resortItems.length === 0 && !isLoading && !isError && (
          <div className="text-center py-20">
            <div className="text-sky-400 text-lg">Hozircha dam olish maskanlari mavjud emas</div>
          </div>
        )}

        {resortItems.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/services/resort"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold rounded-full hover:from-sky-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>{t("resort.see")}</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
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

        @media (max-width: 640px) {
          .grid-cols-1 { gap: 1.5rem; }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .sm\\:grid-cols-2 { gap: 2rem; }
        }

        .bg-gradient-to-br {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }
      `}</style>
    </div>
  );
};

export default ResortHome;