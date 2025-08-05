import React, { useEffect, useState, useRef } from 'react';
import { useGetBanksQuery } from '@/services/api';
import { Bank } from '@/interface';
import { Link } from 'react-router-dom';
import { slugify } from '@/utils/slugify';
import { getLocalizedText } from '@/utils/getLocalized';
import { useTranslation } from 'react-i18next';


const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;

const BankHome: React.FC = () => {
  const { data: banksData = { results: [] }, isLoading, isError } = useGetBanksQuery({ page: 1 });
  const [bankItems, setBankItems] = useState<Bank[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const touchEndRef = useRef<number>(0);
  
  const { t, i18n } = useTranslation();
  type Lang = "uz" | "ru" | "en";
  const lang = (i18n.language.split("-")[0] as Lang) || "en";

  useEffect(() => {
    if (banksData && !isLoading && !isError) {
      setBankItems(banksData.results.slice(0, 4));
    }
  }, [banksData, isLoading, isError]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < bankItems.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bankItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bankItems.length) % bankItems.length);
  };

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

  const BankCard = ({ item, index }: { item: Bank; index: number }) => (
    <Link
      to={`/services/bank/${item.id}-${slugify(item.name)}`}
      className="block transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="bg-white dark:bg-transparent dark:border-blue-950 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-sky-100 group-hover:border-sky-300">
        <div className="relative overflow-hidden">
          {item.images[0]?.photo ? (
            <img
              src={`${MEDIA_URL}${item.images[0].photo}`}
              alt={item.name}
              className="w-full h-48 sm:h-52 lg:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-48 sm:h-52 lg:h-48 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-sky-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-sky-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-sky-900 dark:text-white mb-3 line-clamp-2 group-hover:text-sky-700 transition-colors duration-300">
            {item.name}
          </h3>
          <div className="flex items-center text-gray-600 dark:text-sky-500 text-sm mb-3">
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
              {getLocalizedText({
                uz: item.city.name_uz,
                ru: item.city.name_ru,
                en: item.city.name_en,
              }, lang)}
            </span>
          </div>
          <div className="flex items-center text-[rgba(25,110,150,255)] font-medium text-sm group-hover:text-blue-700 transition-colors duration-300">
            <span>{t("common.details")}</span>
            <svg
              className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[rgba(25,110,150,255)] mb-4">
            {t("banks.title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-900 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
          {bankItems.map((item, index) => (
            <div key={item.id}>
              <BankCard item={item} index={index} />
            </div>
          ))}
        </div>

        {/* Mobile & Tablet Carousel */}
        <div className="lg:hidden relative">
          {bankItems.length > 0 && (
            <>
              {/* Carousel Container */}
              <div 
                className="relative overflow-hidden rounded-2xl"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  ref={carouselRef}
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {bankItems.map((item, index) => (
                    <div key={item.id} className="w-full flex-shrink-0 px-4">
                      <div className="flex justify-center">
                        <div className="w-full max-w-sm">
                          <BankCard item={item} index={index} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              {bankItems.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 z-10"
                    disabled={currentSlide === 0}
                  >
                    <svg
                      className={`w-5 h-5 ${currentSlide === 0 ? 'text-gray-400' : 'text-gray-700 dark:text-white'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 z-10"
                    disabled={currentSlide === bankItems.length - 1}
                  >
                    <svg
                      className={`w-5 h-5 ${currentSlide === bankItems.length - 1 ? 'text-gray-400' : 'text-gray-700 dark:text-white'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {bankItems.length > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {bankItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-[rgba(25,110,150,255)] scale-125 shadow-lg'
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Progress Bar */}
              {bankItems.length > 1 && (
                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-900 to-cyan-500 transition-all duration-300 ease-out"
                    style={{ width: `${((currentSlide + 1) / bankItems.length) * 100}%` }}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Empty State */}
        {bankItems.length === 0 && !isLoading && !isError && (
          <div className="text-center py-20">
            <div className="text-sky-400 text-lg">Hozircha banklar mavjud emas</div>
          </div>
        )}

        {/* View All Button */}
        {bankItems.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/services/banks"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-sky-900 to-cyan-600 text-white font-semibold rounded-full hover:from-sky-900 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>{t("banks.see")}</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      <style>{`
        /* Custom scrollbar for webkit browsers */
        .carousel-container::-webkit-scrollbar {
          display: none;
        }

        /* Smooth scroll behavior */
        .carousel-container {
          scroll-behavior: smooth;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Touch scroll momentum for iOS */
        .carousel-container {
          -webkit-overflow-scrolling: touch;
        }

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

export default BankHome;