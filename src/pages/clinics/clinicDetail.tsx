import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetClinicbyIdQuery } from "@/services/api";
import FallbackImage from "@assets/images/place3.png";
import { getLocalizedText, normalizeBody, normalizeDescription } from "@/utils/getLocalized";
import IMAGE from "@assets/images/samarkand-img.png";
import IMAGE1 from "@assets/images/place1.png";
import IMAGE2 from "@assets/images/place3.png";
import HotelDetailsSkeleton from "@/components/ui/loaderSkleton/hotelDetailsSkeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { openGoogleMaps, openNativeMap, openYandexMaps } from "@/utils/mapnavigate";
import { motion, AnimatePresence } from "framer-motion";

const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;

const ClinicDetail: React.FC = () => {
  const { idSlug } = useParams<{ idSlug: string }>();
  const { t, i18n } = useTranslation();
  type Lang = "uz" | "ru" | "en";
  const lang = (i18n.language.split("-")[0] as Lang) || "en";
  const clinicId = Number(idSlug?.split("-")[0]);
  const {
    data: clinic,
    isLoading,
    isError,
  } = useGetClinicbyIdQuery(Number(clinicId));
  const mockImage = [IMAGE, IMAGE1, IMAGE2];
  const images =
    clinic?.images?.length && clinic.images[0].photo
      ? clinic.images
      : mockImage.map((img, index) => ({ id: index, photo: img }));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide for image carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return <HotelDetailsSkeleton />;
  }

  if (isError || !clinic) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full px-4 md:px-[80px] pt-[100px]"
      >
        <p className="text-center text-red-500">{t("error.failed_to_load_data")}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full px-4 md:px-[80px] pt-[30px] pb-16 max-w-[1200px] md:ml-5 mx-auto"
    >
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2"
      >
        <Link to="/" className="hover:underline text-black">
          {t("breadcrumb.home")}
        </Link>
        <span className="text-black">&gt;</span>
        <Link to="/services" className="hover:underline text-black">
          {t("services.title")}
        </Link>
        <span className="text-black">&gt;</span>
        <Link to="/services/clinics" className="hover:underline text-black">
          {t("services.clinic")}
        </Link>
        <span className="text-black">&gt;</span>
        <span className="text-blue-500">{clinic.name}</span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-2xl md:text-4xl  font-semibold mb-4"
      >
        {clinic.name}
      </motion.h1>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Image and Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full relative h-[300px] md:h-[450px] overflow-hidden rounded-xl"
          >
            <AnimatePresence>
              <motion.img
                key={currentImageIndex}
                src={`${MEDIA_URL}${images[currentImageIndex].photo}`}
                alt={clinic.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FallbackImage;
                }}
              />
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-black" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-black" />
                </motion.button>
              </>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute bottom-3 right-3 bg-white px-3 py-1 text-sm font-medium rounded-md shadow-sm"
            >
              {currentImageIndex + 1} {t("hotelDetail.of")} {images.length}
            </motion.div>

            {images.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2"
              >
                {images.map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-gray-700"
          >
            <h3 className="text-lg font-semibold mb-2">{t("common.address")}</h3>
            <p className="whitespace-pre-line">{getLocalizedText({
              uz: clinic.address.address_uz,
              ru: clinic.address.address_ru,
              en: clinic.address.address_en
            }, lang)}</p>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-gray-700"
          >
            <h3 className="text-lg font-semibold mb-2">{t("common.description")}</h3>
            <p className="whitespace-pre-line leading-relaxed">
              {getLocalizedText(normalizeDescription(clinic.description), lang)}
            </p>
          </motion.div>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-gray-700"
          >
            <h3 className="text-lg font-semibold mb-2">{t("common.details")}</h3>
            <p className="whitespace-pre-line leading-relaxed">
              {getLocalizedText(normalizeBody(clinic.body), lang)}
            </p>
          </motion.div>
        </div>

        {/* Right Column - Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="lg:col-span-1"
        >
          {clinic.latitude && clinic.longitude && (
            <div className="bg-white p-4 rounded-lg shadow-sm sticky top-24">
              <h2 className="text-base md:text-lg font-medium text-blue-900 mb-3">{t("hotelDetail.location_map")}</h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="h-64 lg:h-80 bg-gray-200 overflow-hidden rounded-lg"
              >
                <iframe
                  title="map"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${clinic.latitude},${clinic.longitude}&z=15&output=embed`}
                ></iframe>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="flex flex-col gap-2 mt-3"
              >
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openNativeMap(clinic.latitude, clinic.longitude, clinic.name)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                    title="Telefon navigatorida ochish"
                  >
                    📱 Navigator
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openGoogleMaps(clinic.latitude, clinic.longitude, clinic.name)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                    title="Google Maps da ochish"
                  >
                    🗺️ Google
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openYandexMaps(clinic.latitude, clinic.longitude)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                  title="Yandex Maps da ochish"
                >
                  🗺️ Yandex Maps
                </motion.button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ClinicDetail;