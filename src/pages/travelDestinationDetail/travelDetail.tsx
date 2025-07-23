import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { getLocalizedText } from "@/utils/getLocalized";
import { openGoogleMaps, openNativeMap, openYandexMaps } from "@/utils/mapnavigate";
const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;


export interface MultilangText {
  uz?: string;
  ru?: string;
  en?: string;
}

export interface Tour {
  id: number;
  name: string;
  address: MultilangText;
  latitude: number;
  longitude: number;
  body: MultilangText;
  

}
interface TravelPlaceDetailProps {
  place: Tour;
  nextImage: () => void;
  prevImage: () => void;
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  images: {
    id:number;
    photo: string;
  }[];
}

const TravelPlaceDetail: React.FC<TravelPlaceDetailProps> = ({ place, nextImage, prevImage, currentImageIndex, images, setCurrentImageIndex }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "uz" | "ru" | "en";



  return (
    <div className="w-full px-4 md:px-[80px] pt-[50px] pb-16 max-w-[1500px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2">
        <Link to="/" className="hover:underline text-black">{t("breadcrumb.home")}</Link>
        <span className="text-black">&gt;</span>
        <Link to="/services" className="hover:underline text-black">{t("services.title")}</Link>
        <span className="text-black">&gt;</span>
        <Link to="/services/tours" className="hover:underline text-black">{t("services.tour-firm")}</Link>
        <span className="text-black">&gt;</span>
        <span className="text-[#DE5D26]">{place.name}</span>
      </div>

      <div className="font-serif mt-3 md:mt-5">
        <h1 className="text-[24px] text-[#131313] leading-[100%] mb-1">
          {place.name}
        </h1>

        <div className="flex flex-row items-center mb-3 md:mb-4">
          <div className="text-[#00000040] font-medium text-[15px] flex flex-row ">
            <span><MapPin /></span>
            <span>{getLocalizedText(place.address, lang)}</span>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Image and Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="w-full relative h-[300px] md:h-[450px] overflow-hidden rounded-xl">
              <img
                src={`${MEDIA_URL}${images[currentImageIndex].photo}`}
                alt={place.name}
                className="w-full h-full "
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

            <div className="text-gray-700">
              <h3 className="text-lg font-semibold mb-2">{t("common.address")}</h3>
              <p className="whitespace-pre-line">{getLocalizedText(place.address, lang)}</p>
            </div>


            {/* Body */}
            <div className="text-gray-700">
              <h3 className="text-lg font-semibold mb-2">{t("common.details")}</h3>
              <p className="whitespace-pre-line leading-relaxed">
                {getLocalizedText(place.body, lang)}
              </p>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="lg:col-span-1">
            {/* Google Map */}
            {place.latitude && place.longitude && (
              <div className="bg-white p-4 rounded-lg shadow-sm sticky top-24">
                <h2 className="text-base md:text-lg font-medium text-[#DE5D26] mb-3">{t("hotelDetail.location_map")}</h2>
                <div className="h-64 lg:h-80 bg-gray-200 overflow-hidden rounded-lg">
                  <iframe
                    title="map"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${place.latitude},${place.longitude}&z=15&output=embed`}
                  ></iframe>
                </div>
                <div className="flex flex-col gap-2 mb-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openNativeMap(place.latitude, place.longitude, place.name)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                      title="Telefon navigatorida ochish"
                    >
                      📱 Navigator
                    </button>
                    <button
                      onClick={() => openGoogleMaps(place.latitude, place.longitude, place.name)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                      title="Google Maps da ochish"
                    >
                      🗺️ Google
                    </button>
                  </div>
                  <button
                    onClick={() => openYandexMaps(place.latitude, place.longitude)}
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
    </div>
  );
};

export default TravelPlaceDetail;