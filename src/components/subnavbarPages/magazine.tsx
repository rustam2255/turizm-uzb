import React, { useEffect, useState, useRef } from 'react';
import { useGetMagazinesQuery } from '@/services/api';
import { MagazineItem } from '@/interface';
import { Link } from 'react-router-dom';
import { slugify } from '@/utils/slugify';
import { useTranslation } from "react-i18next";

const MagazineHome: React.FC = () => {
  const { data: magazines = {}, isLoading, isError } = useGetMagazinesQuery();
  const [magazineItems, setMagazineItems] = useState<MagazineItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0] as "uz" | "ru" | "en";
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const touchEndRef = useRef<number>(0);

  useEffect(() => {
    if (magazines && !isLoading && !isError) {
      const year2025 = magazines['2025'] || [];
      const filteredItems = year2025.slice(0, 5);
      setMagazineItems(filteredItems);
    }
  }, [magazines, isLoading, isError]);

  // Auto-play carousel removed

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

    if (isLeftSwipe && currentSlide < magazineItems.length - 1) {
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
    setCurrentSlide((prev) => (prev + 1) % magazineItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + magazineItems.length) % magazineItems.length);
  };

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
    <>
      {magazineItems.length > 0 && (
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[rgba(25,110,150,255)] mb-4">
                {t("magazine.title_home")}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-sky-900 to-cyan-500 mx-auto rounded-full"></div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6">
              {magazineItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/magazines/${item.id}-${slugify(item.title.en)}`}
                  className="group block transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={item.card}
                      alt={`${item.title.en} magazine cover`}
                      loading='lazy'
                      className="w-full rounded-xl h-[300px] md:w-[200px] md:h-[250px] object-cover mb-4 transition-transform duration-200 hover:scale-105 shadow-lg"
                    />
                    <div className="text-center text-black font-normal leading-[100%]">
                      <p className="mb-1 dark:text-white text-[14px] md:text-[15px]">{item.month}</p>
                      <p className="mb-1 text-[14px] dark:text-sky-500 md:text-[15px]">
                        {getLocalizedText(item.title)}
                      </p>
                      <p className="text-[14px] dark:text-white md:text-[15px]">{item.year}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-center text-[rgba(25,110,150,255)] font-medium text-sm group-hover:text-blue-700 transition-colors duration-300">
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

            {/* Mobile Carousel */}
            <div className="lg:hidden relative">
              {magazineItems.length > 0 && (
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
                      {magazineItems.map((item) => (
                        <div key={item.id} className="w-full flex-shrink-0">
                          <Link
                            to={`/magazines/${item.id}-${slugify(item.title.en)}`}
                            className="block"
                          >
                            <div className="rounded-2xl p-6 mx-2">
                              <div className="flex flex-col items-center">
                                {/* Magazine Cover */}
                                <div className="relative mb-6">
                                  <img
                                    src={item.card}
                                    loading='lazy'
                                    alt={`${item.title.en} magazine cover`}
                                    className="w-48 h-64 sm:w-56 sm:h-72 object-cover rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 rounded-xl"></div>
                                </div>

                                {/* Magazine Info */}
                                <div className="text-center space-y-2">
                                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                    {item.month}
                                  </p>
                                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white px-4">
                                    {getLocalizedText(item.title)}
                                  </h3>
                                  <p className="text-2xl font-bold text-[rgba(25,110,150,255)] dark:text-sky-400">
                                    {item.year}
                                  </p>
                                </div>

                                {/* Action Button */}
                                <div className="mt-6">
                                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-900 to-cyan-600 text-white font-semibold rounded-full hover:from-sky-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                                    <span className="text-sm">{t("common.details")}</span>
                                    <svg
                                      className="w-4 h-4 ml-2"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Arrows */}
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
                    disabled={currentSlide === magazineItems.length - 1}
                  >
                    <svg
                      className={`w-5 h-5 ${currentSlide === magazineItems.length - 1 ? 'text-gray-400' : 'text-gray-700 dark:text-white'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Dots Indicator */}
                  <div className="flex justify-center mt-6 space-x-2">
                    {magazineItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                            ? 'bg-[rgba(25,110,150,255)] scale-125 shadow-lg'
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                          }`}
                      />
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-900 to-cyan-500 transition-all duration-300 ease-out"
                      style={{ width: `${((currentSlide + 1) / magazineItems.length) * 100}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* View All Button */}
            {magazineItems.length > 0 && (
              <div className="text-center mt-12">
                <Link
                  to="/magazines"
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-sky-900 to-cyan-600 text-white font-semibold rounded-full hover:from-sky-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
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
      `}</style>
        </div>
      )}
    </>

  );
};

export default MagazineHome;