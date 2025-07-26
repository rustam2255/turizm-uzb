
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getLocalizedText } from "@/utils/getLocalized";
import { openGoogleMaps, openNativeMap, openYandexMaps } from "@/utils/mapnavigate";
import { stripHtmlTags } from "@/utils/getHtmlTags";
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
    id: number;
    photo: string;
  }[];
}

const TravelPlaceDetail: React.FC<TravelPlaceDetailProps> = ({ place, nextImage, prevImage, currentImageIndex, images, setCurrentImageIndex }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "uz" | "ru" | "en";

  return (
    <motion.div
      className="w-full px-4 md:px-[80px] pt-[50px] pb-16 max-w-[1200px] md:ml-5 mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb */}
      <motion.div
        className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Link to="/" className="hover:underline text-black">{t("breadcrumb.home")}</Link>
        <span className="text-black">&gt;</span>
        <Link to="/services" className="hover:underline text-black">{t("services.title")}</Link>
        <span className="text-black">&gt;</span>
        <Link to="/services/tours" className="hover:underline text-black">{t("services.tour-firm")}</Link>
        <span className="text-black">&gt;</span>
        <span className="text-sky-400">{place.name}</span>
      </motion.div>

      <motion.div
        className=" mt-3 md:mt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h1
          className="text-[24px] text-[#131313] leading-[100%] mb-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {place.name}
        </motion.h1>

        <motion.div
          className="flex flex-row items-center mb-3 md:mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="text-[#00000040] font-medium text-[15px] flex flex-row ">
            <span><MapPin /></span>
            <span>{getLocalizedText(place.address, lang)}</span>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {/* Left Column - Image and Information */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* Image */}
            <motion.div
              className="w-full relative h-[300px] md:h-[450px] overflow-hidden rounded-xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <motion.img
                src={`${MEDIA_URL}${images[currentImageIndex].photo}`}
                alt={place.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              />

              {images.length > 1 && (
                <>
                  <motion.button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <ChevronLeft className="w-5 h-5 text-black" />
                  </motion.button>
                  <motion.button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <ChevronRight className="w-5 h-5 text-black" />
                  </motion.button>
                </>
              )}

              <motion.div
                className="absolute bottom-3 right-3 bg-white px-3 py-1 text-sm font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                {currentImageIndex + 1} {t("hotelDetail.of")} {images.length}
              </motion.div>

              {images.length > 1 && (
                <motion.div
                  className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                >
                  {images.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className="text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-2">{t("common.address")}</h3>
              <p className="whitespace-pre-line">{getLocalizedText(place.address, lang)}</p>
            </motion.div>

            {/* Body */}
            <motion.div
              className="text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-2">{t("common.details")}</h3>
              <p className="whitespace-pre-line leading-relaxed">
                {stripHtmlTags(getLocalizedText(place.body, lang))}
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Map */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* Google Map */}
            {place.latitude && place.longitude && (
              <motion.div
                className="bg-white p-4 rounded-lg shadow-sm sticky top-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                <motion.h2
                  className="text-base md:text-lg font-medium text-blue-900 mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  {t("hotelDetail.location_map")}
                </motion.h2>
                <div className="h-64 lg:h-80 bg-gray-200 overflow-hidden rounded-lg">
                  <iframe
                    title="map"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${place.latitude},${place.longitude}&z=15&output=embed`}
                  ></iframe>
                </div>
                <motion.div
                  className="flex flex-col gap-2 mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => openNativeMap(place.latitude, place.longitude, place.name)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.7, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      📱 Navigator
                    </motion.button>
                    <motion.button
                      onClick={() => openGoogleMaps(place.latitude, place.longitude, place.name)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.7, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      🗺️ Google
                    </motion.button>
                  </div>
                  <motion.button
                    onClick={() => openYandexMaps(place.latitude, place.longitude)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    🗺️ Yandex Maps
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TravelPlaceDetail;
