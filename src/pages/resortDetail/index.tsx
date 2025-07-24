import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, LocateFixed, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetResortDetailQuery } from "@/services/api";
import FallbackImage from "@assets/images/place3.png";
import { getLocalizedText } from "@/utils/getLocalized";
import IMAGE from "@assets/images/samarkand-img.png";
import IMAGE1 from "@assets/images/place1.png";
import IMAGE2 from "@assets/images/place3.png"
const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;
import HotelDetailsSkeleton from "@/components/ui/loaderSkleton/hotelDetailsSkeleton";
import { openGoogleMaps, openNativeMap, openYandexMaps } from "@/utils/mapnavigate";
import { stripHtmlTags } from "@/utils/getHtmlTags";

const ResortDetail: React.FC = () => {
  const { idSlug } = useParams<{ idSlug: string }>();
  const resortId = Number(idSlug?.split("-")[0]);
  const { t, i18n } = useTranslation();
  type Lang = "uz" | "ru" | "en";
  const lang = (i18n.language.split("-")[0] as Lang) || "en";

  const {
    data: resort,
    isLoading,
    isError,
  } = useGetResortDetailQuery(resortId);

  const mockImage = [
    IMAGE, IMAGE1, IMAGE2
  ]
  const images =
    resort?.images?.length && resort.images[0].photo
      ? resort.images
      : mockImage.map((img, index) => ({ id: index, photo: img }));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  if (isLoading) {
    return <HotelDetailsSkeleton />
  }

  if (isError || !resort) {
    return (
      <div className="w-full px-4 md:px-[80px] pt-[100px]">
        <p className="text-center text-red-500">{t("error.failed_to_load_data")}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-[80px] pt-[100px] pb-16 max-w-[1200px] md:ml-5 mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2">
        <Link to="/" className="hover:underline text-black">{t("breadcrumb.home")}</Link>
        <span className="text-black">&gt;</span>
        <Link to="/services" className="hover:underline text-black">{t("services.title")}</Link>
        <span className="text-black">&gt;</span>
        <Link to="/services/resort" className="hover:underline text-black">{t("services.resort")}</Link>
        <span className="text-black">&gt;</span>
        <span className="text-[#DE5D26]">{resort.name}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-serif font-semibold mb-4">{resort.name}</h1>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Image and Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="w-full relative h-[300px] md:h-[450px] overflow-hidden rounded-xl">
            <img
              src={`${MEDIA_URL}${images[currentImageIndex].photo}`}
              alt={resort.name}
              className="w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FallbackImage;
              }}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-black" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-black" />
                </button>
              </>
            )}

            <div className="absolute bottom-3 right-3 bg-white px-3 py-1 text-sm font-medium">
              {currentImageIndex + 1} {t("hotelDetail.of")} {images.length}
            </div>


            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span className="truncate font-medium">
                {getLocalizedText(resort.city, lang)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LocateFixed size={18} />
              <span className="truncate italic">{getLocalizedText(resort.type, lang)}</span>
            </div>
          </div>

          {/* Address */}
          <div className="text-gray-700">
            <h3 className="text-lg font-semibold mb-2">{t("common.address")}</h3>
            <p className="whitespace-pre-line">{getLocalizedText(resort.address, lang)}</p>
          </div>

          {/* Description */}
          <div className="text-gray-700">
            <h3 className="text-lg font-semibold mb-2">{t("common.description")}</h3>
            <p className="whitespace-pre-line leading-relaxed">
              {getLocalizedText(resort.description, lang)}
            </p>
          </div>

          {/* Body */}
          <div className="text-gray-700">
            <h3 className="text-lg font-semibold mb-2">{t("common.details")}</h3>
            <p className="whitespace-pre-line leading-relaxed">
              {stripHtmlTags(getLocalizedText(resort.body, lang))}
            </p>
          </div>
        </div>

        {/* Right Column - Map */}
        <div className="lg:col-span-1">
          {/* Google Map */}
          {resort.latitude && resort.longitude && (
            <div className="bg-white p-4 rounded-lg shadow-sm sticky top-24">
              <h2 className="text-base md:text-lg font-medium text-[#DE5D26] mb-3">{t("hotelDetail.location_map")}</h2>
              <div className="h-64 lg:h-80 bg-gray-200 overflow-hidden rounded-lg">
                <iframe
                  title="map"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${resort.latitude},${resort.longitude}&z=15&output=embed`}
                ></iframe>
              </div>
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => openNativeMap(resort.latitude, resort.longitude, resort.name)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                    title="Telefon navigatorida ochish"
                  >
                    📱 Navigator
                  </button>
                  <button
                    onClick={() => openGoogleMaps(resort.latitude, resort.longitude, resort.name)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                    title="Google Maps da ochish"
                  >
                    🗺️ Google
                  </button>
                </div>
                <button
                  onClick={() => openYandexMaps(resort.latitude, resort.longitude)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
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

export default ResortDetail;