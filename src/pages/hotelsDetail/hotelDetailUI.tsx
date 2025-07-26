
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Award, ChevronLeft, ChevronRight } from "lucide-react";
import HotelDetailsSkeleton from "@/components/ui/loaderSkleton/hotelDetailsSkeleton";
import NearHotels from "@/components/nearHotels";
import IMAGE from "@assets/images/samarkand-img.png";
import IMAGE1 from "@assets/images/place1.png";
import IMAGE2 from "@assets/images/place3.png";
import { useGetHotelByIdQuery } from "@/services/api";
import { openGoogleMaps, openNativeMap, openYandexMaps } from "@/utils/mapnavigate";
import { stripHtmlTags } from "@/utils/getHtmlTags";

const HotelDetailsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { idSlug } = useParams<{ idSlug: string }>();

  const hotelId = Number(idSlug?.split("-")[0]);
  const mockImage = [IMAGE, IMAGE1, IMAGE2];
  const supportedLangs = ["uz", "ru", "en"];
  const lang = supportedLangs.includes(i18n.language) ? i18n.language : "en";

  const { data: hotel, isLoading, isError } = useGetHotelByIdQuery(hotelId!, {
    skip: !hotelId,
  });

  const images =
    hotel?.images?.length && hotel.images[0].image
      ? hotel.images
      : mockImage.map((img, index) => ({ id: index, image: img }));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isLoading) return <HotelDetailsSkeleton />;
  if (isError || !hotel) return <div>{t("error.loading")}</div>;

  return (
    <motion.div
      className="max-w-[1200px] md:ml-5 mx-auto py-5 md:py-7.5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center text-[14px] font-medium md:text-[18px] gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Link to="/" className="hover:underline text-black">{t("breadcrumb.home")}</Link>
        <span className="text-black">&gt;</span>
        <span className="text-blue-500">{t("breadcrumb.hotels")}</span>
      </motion.div>

      <motion.h1
        className="text-[20px]  md:text-[24px] text-black leading-[100%] mb-2 mt-4 md:mt-5 md:mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {hotel.name}
      </motion.h1>

      <motion.div
        className="grid grid-cols-1  lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.div
            className="relative mb-3 md:mb-5"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.img
              src={images[currentImageIndex].image}
              alt={hotel.name}
              className="w-full h-[400px] rounded-xl object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            />

            {images.length > 1 && (
              <>
                <motion.button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <ChevronLeft className="w-5 h-5 text-black" />
                </motion.button>
                <motion.button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
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
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {currentImageIndex + 1} {t("hotelDetail.of")} {images.length}
            </motion.div>

            {images.length > 1 && (
              <motion.div
                className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                {images.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
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
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-2">{t("common.description")}</h3>
            <p className="whitespace-pre-line leading-relaxed">
              {hotel.description?.[lang]}
            </p>
          </motion.div>
          <motion.div
            className="text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-2">{t("common.details")}</h3>
            <p className="whitespace-pre-line leading-relaxed">
              {stripHtmlTags(hotel.body?.[lang])}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.div
            className="bg-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <h2 className="text-[20px] md:text-[24px] text-sky-900 mb-4">{t("hotelDetail.amenities")}</h2>
            <ul className="space-y-3">
              {hotel.amenities.length > 0 ? (
                hotel.amenities.map((amenity) => (
                  <motion.li
                    key={amenity.id}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + amenity.id * 0.1, duration: 0.5 }}
                  >
                    <Award className="w-5 h-5 text-black" />
                    <p className="text-[14px] font-medium leading-[26px] md:text-[18px]">
                      {amenity.name[lang]}
                    </p>
                  </motion.li>
                ))
              ) : (
                <p className="text-sm text-gray-500">{t("no_amenities")}</p>
              )}
            </ul>
          </motion.div>

          <motion.div
            className="bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            <h2 className="text-[15px] md:text-[18px] font-medium text-sky-900 mb-1">{t("hotelDetail.location_map")}</h2>
            <div className="h-64 bg-gray-200 overflow-hidden">
              <iframe
                title="map"
                width="100%"
                height="100%"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`}
              ></iframe>
            </div>
            <motion.div
              className="flex flex-col gap-2 mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <div className="flex gap-2">
                <motion.button
                  onClick={() => openNativeMap(hotel.latitude, hotel.longitude, hotel.name)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  📱 Navigator
                </motion.button>
                <motion.button
                  onClick={() => openGoogleMaps(hotel.latitude, hotel.longitude, hotel.name)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  🗺️ Google
                </motion.button>
              </div>
              <motion.button
                onClick={() => openYandexMaps(hotel.latitude, hotel.longitude)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                🗺️ Yandex Maps
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            className="bg-white mt-2 md:mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            <h2 className="text-[15px] md:text-[18px] font-medium text-[#DE5D26] mb-2">{t("hotelDetail.contact")}</h2>
            <div className="space-y-2 font-medium text-[15px] md:text-[18px]">
              <h3 className="text-lg font-semibold mb-2">{t("common.address")}</h3>
              <motion.p
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.9, duration: 0.5 }}
              >
                <MapPin className="w-5 h-5 text-black mt-0.5" />
                <span>{hotel.address?.[lang]}</span>
              </motion.p>
              <motion.p
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.0, duration: 0.5 }}
              >
                <Phone className="w-5 h-5 text-black" />
                <a
                  href={`tel:${hotel.phone?.replace(/[^0-9+]/g, "")}`}
                  className="hover:underline"
                >
                  {hotel.phone}
                </a>
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      <NearHotels hotelId={hotel.id.toString()} />
    </motion.div>
  );
};

export default HotelDetailsPage;
