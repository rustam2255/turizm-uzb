import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetMarketbyIdQuery } from "@/services/api";
import FallbackImage from "@assets/images/place3.png";
import { getLocalizedText, normalizeBody, normalizeDescription } from "@/utils/getLocalized";
import IMAGE from "@assets/images/samarkand-img.png";
import IMAGE1 from "@assets/images/place1.png";
import IMAGE2 from "@assets/images/place3.png";
import HotelDetailsSkeleton from "@/components/ui/loaderSkleton/hotelDetailsSkeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { openGoogleMaps, openNativeMap, openYandexMaps } from "@/utils/mapnavigate";
import { stripHtmlTags } from "@/utils/getHtmlTags";

const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;

const MarketDetail: React.FC = () => {
  const { idSlug } = useParams<{ idSlug: string }>();
  const marketId = Number(idSlug?.split("-")[0]);
  const { t, i18n } = useTranslation();
  type Lang = "uz" | "ru" | "en";
  const lang = (i18n.language.split("-")[0] as Lang) || "en";

  const {
    data: market,
    isLoading,
    isError,
  } = useGetMarketbyIdQuery(marketId);

  const mockImage = [
    IMAGE, IMAGE1, IMAGE2
  ];

  const images =
    market?.images?.length && market.images[0].photo
      ? market.images
      : mockImage.map((img, index) => ({ id: index, photo: img }));

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    // Sahifaga kirganda animatsiyalarni boshlash
    const elements = document.querySelectorAll('.animate-slide-in-left, .animate-slide-in-right, .animate-fade-in, .animate-slide-up');
    elements.forEach((el, index) => {
      el.classList.add('opacity-0');
      setTimeout(() => {
        el.classList.remove('opacity-0');
      }, index * 100);
    });
  }, [market]);

  if (isLoading) {
    return <HotelDetailsSkeleton />;
  }

  if (isError || !market) {
    return (
      <div className="w-full px-4 md:px-[80px] pt-[30px] bg-gradient-to-b from-white to-[#4DC7E8]/5 min-h-screen animate-fade-in">
        <p className="text-center text-red-500 text-[16px] md:text-[18px] font-medium">{t("error.failed_to_load_data")}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-[80px] pt-[30px] pb-16 max-w-[1200px] md:ml-5 mx-auto bg-gradient-to-b from-white to-[#4DC7E8]/5 min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center text-[14px] md:text-[16px] font-medium gap-2 animate-slide-in-left text-[#131313]">
        <Link to="/" className="hover:text-[#4DC7E8] transition-colors duration-200">{t("breadcrumb.home")}</Link>
        <span className="text-[#4DC7E8]">&gt;</span>
        <Link to="/services" className="hover:text-[#4DC7E8] transition-colors duration-200">{t("services.title")}</Link>
        <span className="text-[#4DC7E8">&gt;</span>
        <Link to="/services/market" className="hover:text-[#4DC7E8] transition-colors duration-200">{t("services.market")}</Link>
        <span className="text-[#4DC7E8">&gt;</span>
        <span className="text-[#4DC7E8] font-semibold">{market.name}</span>
      </div>

      {/* Title */}
      <h1 className="text-[24px] md:text-[36px] font-semibold mb-4 animate-slide-in-right text-[#131313]">{market.name}</h1>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Image and Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Carousel */}
          <div className="w-full relative h-[300px] md:h-[450px] overflow-hidden rounded-xl animate-slide-up border border-[#4DC7E8]/10 shadow-md shadow-[#4DC7E8]/20">
            <img
              src={`${MEDIA_URL}${images[currentImageIndex].photo}`}
              alt={market.name}
              className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FallbackImage;
              }}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40 transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5 text-[#4DC7E8]" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40 transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5 text-[#4DC7E8]" />
                </button>
              </>
            )}

            <div className="absolute bottom-3 right-3 bg-white/80 px-3 py-1 text-sm font-medium text-[#4DC7E8] rounded-md shadow-sm shadow-[#4DC7E8]/20 animate-fade-in">
              {currentImageIndex + 1} {t("hotelDetail.of")} {images.length}
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all hover:scale-125 ${index === currentImageIndex ? 'bg-[#4DC7E8] scale-125' : 'bg-[#4DC7E8]/50'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Address */}
          <div className="text-gray-700 animate-slide-in-left">
            <h3 className="text-lg font-semibold mb-2 text-[#131313]">{t("common.address")}</h3>
            <p className="whitespace-pre-line">{getLocalizedText({
              uz: market.address.address_uz,
              ru: market.address.address_ru,
              en: market.address.address_en
            }, lang)}</p>
          </div>

          {/* Description */}
          <div className="text-gray-700 animate-slide-in-right">
            <h3 className="text-lg font-semibold mb-2 text-[#131313]">{t("common.description")}</h3>
            <p className="whitespace-pre-line leading-relaxed">
              {getLocalizedText(normalizeDescription(market.description), lang)}
            </p>
          </div>

          {/* Body */}
          <div className="text-gray-700 animate-slide-in-left">
            <h3 className="text-lg font-semibold mb-2 text-[#131313]">{t("common.details")}</h3>
            <p className="whitespace-pre-line leading-relaxed">
              {stripHtmlTags(getLocalizedText(normalizeBody(market.body), lang))}
            </p>
          </div>
        </div>

        {/* Right Column - Map */}
        <div className="lg:col-span-1">
          {market.latitude && market.longitude && (
            <div className="bg-white p-4 rounded-xl shadow-md shadow-[#4DC7E8]/20 border border-[#4DC7E8]/10 sticky top-24 animate-slide-up">
              <h2 className="text-base md:text-lg font-medium text-[#4DC7E8] mb-3">{t("hotelDetail.location_map")}</h2>
              <div className="h-64 lg:h-80 bg-[#4DC7E8]/10 overflow-hidden rounded-md shadow-sm shadow-[#4DC7E8]/20 transition-transform duration-300 hover:scale-105">
                <iframe
                  title="map"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${market.latitude},${market.longitude}&z=15&output=embed`}
                ></iframe>
              </div>
              <div className="flex flex-col gap-2 mb-3 mt-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => openNativeMap(market.latitude, market.longitude, market.name)}
                    className="flex-1 bg-[#4DC7E8] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 rounded text-sm transition-all duration-300 shadow-sm shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40 hover:scale-105"
                    title="Telefon navigatorida ochish"
                  >
                    📱 Navigator
                  </button>
                  <button
                    onClick={() => openGoogleMaps(market.latitude, market.longitude, market.name)}
                    className="flex-1 bg-[#4DC7E8] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 rounded text-sm transition-all duration-300 shadow-sm shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40 hover:scale-105"
                    title="Google Maps da ochish"
                  >
                    🗺️ Google
                  </button>
                </div>
                <button
                  onClick={() => openYandexMaps(market.latitude, market.longitude)}
                  className="w-full bg-[#4DC7E8] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 rounded text-sm transition-all duration-300 shadow-sm shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40 hover:scale-105"
                  title="Yandex Maps da ochish"
                >
                  🗺️ Yandex Maps
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// CSS animatsiyalari
const styles = `
  .animate-slide-up {
    animation: slideUp 0.5s ease-out forwards;
    opacity: 0;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.5s ease-out forwards;
    opacity: 0;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.5s ease-out forwards;
    opacity: 0;
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
    opacity: 0;
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideInLeft {
    from {
      transform: translateX(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// CSS ni qo'shish
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default MarketDetail;