import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import HotelCard from "@components/hotelCard";
import { useGetHotelsQuery } from "@/services/api";
import { Link } from "react-router-dom";

const HotelCardUI: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as "uz" | "ru" | "en";
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const touchEndRef = useRef<number>(0);

  const { data: hotelsData, error, isLoading } = useGetHotelsQuery({ page: 1 });

  const getLocalizedText = (field?: { uz?: string; en?: string; ru?: string }): string => {
    if (!field) return "";
    return field[currentLang] || field.en || "";
  };

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

    if (isLeftSwipe && currentSlide < hotels.length - 1) {
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
    setCurrentSlide((prev) => (prev + 1) % hotels.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + hotels.length) % hotels.length);
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
    <>
      {hotelsData.results.length > 0 && (
        <div className="lg:py-5">
          <div className="max-w-[1900px] mx-auto px-1 lg:px-8">
            {/* Header Section */}
            <div className="text-center mb-12 sm:mb-12">
              <h2 className="md:text-3xl text-sm   lg:text-3xl font-bold text-[rgba(25,110,150,255)] mb-4">
                {t("hotels.the_suite_hotels")}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-sky-900 to-cyan-500 mx-auto rounded-full"></div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
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

            {/* Mobile & Tablet Carousel */}
            <div className="lg:hidden relative">
              {hotels.length > 0 && (
                <>
                  {/* Carousel Container */}
                  <div
                    className="relative overflow-hidden "
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div
                      ref={carouselRef}
                      className="flex transition-transform duration-300 ease-in-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {hotels.map((hotel) => (
                        <div key={hotel.id} className="w-full flex-shrink-0 px-4">
                          <div className="flex justify-center">
                            <div className="w-full max-w-sm">
                              <HotelCard
                                id={hotel.id}
                                name={hotel.name}
                                images={Array.isArray(hotel.images) ? hotel.images : hotel.images ? [hotel.images] : []}
                                description={getLocalizedText(hotel.description)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  {hotels.length > 1 && (
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
                        disabled={currentSlide === hotels.length - 1}
                      >
                        <svg
                          className={`w-5 h-5 ${currentSlide === hotels.length - 1 ? 'text-gray-400' : 'text-gray-700 dark:text-white'}`}
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
                  {hotels.length > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                      {hotels.map((_, index) => (
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
                  )}

                  {/* Progress Bar */}
                  {hotels.length > 1 && (
                    <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-900 to-cyan-500 transition-all duration-300 ease-out"
                        style={{ width: `${((currentSlide + 1) / hotels.length) * 100}%` }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* View All Button */}
            {hotelsData && (
              <div className="text-center mt-16">
                <Link
                  to="/hotels"
                  className="inline-flex items-center px-2 py-1 md:px-8 md:py-3 bg-gradient-to-r from-sky-900 to-cyan-600 text-white font-semibold hover:from-sky-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>{t('hotels.see')}</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}

            {/* Empty State */}
            {hotels.length === 0 && !isLoading && !error && (
              <div className="text-center py-20">
                <div className="text-gray-400 text-lg">Hozircha mehmonxonalar mavjud emas</div>
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

        /* Animation for hotel cards */
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

        .hotel-card-animate {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
        </div>
      )}
    </>

  );
};

export default HotelCardUI;