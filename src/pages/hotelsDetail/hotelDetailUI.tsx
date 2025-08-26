import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, ChevronLeft, ChevronRight, ZoomIn, Zap, } from "lucide-react";

import HotelDetailsSkeleton from "@/components/ui/loaderSkleton/hotelDetailsSkeleton";
import NearHotels from "@/components/nearHotels";
import IMAGE from "@assets/images/samarkand-img.png";
import IMAGE1 from "@assets/images/place1.png";
import IMAGE2 from "@assets/images/place3.png";
import { useGetHotelByIdQuery } from "@/services/api";
import { openGoogleMaps, openNativeMap, openYandexMaps } from "@/utils/mapnavigate";
import { stripHtmlTags } from "@/utils/getHtmlTags";
import {
  Award,
  Wifi,
  Car,
  Utensils,
  Coffee,
  Dumbbell,
  Waves,
  Flower2,
  Beer,
  Tv,
  Snowflake,
  ConciergeBell,
  Briefcase,
  ShoppingBag,
  Baby,
  Bus,
} from "lucide-react";
import GalleryModal from "@/utils/galleryModal";

// icon mapping
const amenityIcons: Record<string, React.ElementType> = {
  default: Award,
  freewifi: Wifi,
  parking: Car,
  restaurant: Utensils,
  buffetbreakfastavailable: Coffee,
  gym: Dumbbell,
  pool: Waves,
  spa: Flower2,
  bar: Beer,
  tv: Tv,
  airconditioner: Snowflake,
  roomservice: ConciergeBell,
  conference: Briefcase,
  shop: ShoppingBag,
  playground: Baby,
  airportshuttle: Bus,
  evcharging: Zap,
};

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isLoading) return <HotelDetailsSkeleton />;
  if (isError || !hotel)
    return (
      <div className="text-center text-red-500 text-[16px] md:text-[18px] font-medium my-8">
        {t("error.loading")}
      </div>
    );

  return (
    <motion.div
      className="max-w-[1000px] md:ml-5 mx-auto py-5 md:py-7.5 bg-gradient-to-b from-white to-[#4DC7E8]/5 min-h-screen dark:bg-[oklch(22% 0.06 265 / 0.9)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* breadcrumb */}
      <motion.div
        className="flex items-center text-[14px] md:text-[16px] font-medium gap-2 text-[#131313]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Link to="/" className="hover:text-[#4DC7E8] transition-colors duration-200">
          {t("breadcrumb.home")}
        </Link>
        <span>&gt;</span>
        <span className="text-[rgba(25,110,150,255)] font-semibold">{t("breadcrumb.hotels")}</span>
      </motion.div>

      {/* title */}
      <motion.p
        className="text-[20px] md:text-[24px] text-[#131313] leading-[100%] mb-2 mt-4 md:mt-5 md:mb-5 font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {hotel.name}
      </motion.p>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* left side */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* image slider */}
          <motion.div
            className="relative mb-3 md:mb-5 border border-[#4DC7E8]/10 rounded-xl shadow-md shadow-[#4DC7E8]/20"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.img
              src={images[currentImageIndex].image}
              alt={hotel.name}
              className="w-full h-[400px] rounded-xl object-cover cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              onClick={openModal}
            />
            {isHovered && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onClick={openModal}
              >
                <ZoomIn className="w-10 h-10 text-white bg-[rgba(25,110,150,0.7)] p-2 rounded-full" />
              </motion.div>
            )}
            {images.length > 1 && (
              <>
                <motion.button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                  whileHover={{ scale: 1.1 }}
                >
                  <ChevronLeft className="w-5 h-5 text-[rgba(25,110,150,255)]" />
                </motion.button>
                <motion.button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                  whileHover={{ scale: 1.1 }}
                >
                  <ChevronRight className="w-5 h-5 text-[rgba(25,110,150,255)]" />
                </motion.button>
              </>
            )}
          </motion.div>

          {/* description */}
          <motion.div className="text-gray-700" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-lg font-semibold mb-2 text-[#131313] leading-relaxed">{hotel.description?.[lang]}</p>
          </motion.div>
          <motion.div className="text-gray-700" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="whitespace-pre-line">{stripHtmlTags(hotel.body?.[lang])}</p>
          </motion.div>
        </motion.div>

        {/* right side */}
        <motion.div className="lg:col-span-1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
          {/* amenities */}
          <motion.div className="bg-white mb-4 p-4 rounded-xl shadow-md border border-[#4DC7E8]/10">
            <h2 className="text-[20px] md:text-[24px] text-[rgba(25,110,150,255)] mb-4 font-semibold">
              {t("hotelDetail.amenities")}
            </h2>
            <ul className="space-y-3">
              {hotel.amenities.length > 0 ? (
                hotel.amenities.map((amenity) => {
                  const key = amenity.name.en?.toLowerCase().replace(/\s+/g, "") || "";
                  const Icon = amenityIcons[key] || Award;
                  return (
                    <li key={amenity.id} className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-[rgba(25,110,150,255)]" />
                      <p className="text-[14px] md:text-[18px] font-medium text-[#131313]">
                        {amenity.name[lang]}
                      </p>
                    </li>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">{t("no_amenities")}</p>
              )}
            </ul>
          </motion.div>

          {/* map */}
          <motion.div className="bg-white p-4 rounded-xl shadow-md border border-[#4DC7E8]/10">
            <h2 className="text-[15px] md:text-[18px] font-medium text-[rgba(25,110,150,255)] mb-1">
              {t("hotelDetail.location_map")}
            </h2>
            <div className="h-64 bg-[#4DC7E8]/10 overflow-hidden rounded-md">
              <iframe
                title="map"
                width="100%"
                height="100%"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`}
              ></iframe>
            </div>
            <motion.div
              className="flex flex-col gap-2 mb-3 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <div className="flex gap-2">
                <motion.button
                  onClick={() => openNativeMap(hotel.latitude, hotel.longitude, hotel.name)}
                  className="flex-1 bg-[rgba(25,110,150,255)] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 rounded text-sm transition-all duration-300 shadow-sm shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  📱 Navigator
                </motion.button>
                <motion.button
                  onClick={() => openGoogleMaps(hotel.latitude, hotel.longitude, hotel.name)}
                  className="flex-1 bg-[rgba(25,110,150,255)] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 rounded text-sm transition-all duration-300 shadow-sm shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40"
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
                className="w-full bg-[rgba(25,110,150,255)] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 rounded text-sm transition-all duration-300 shadow-sm shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                🗺️ Yandex Maps
              </motion.button>
            </motion.div>
          </motion.div>

          {/* contact */}
          <motion.div className="bg-white mt-2 md:mt-4 p-4 rounded-xl shadow-md border border-[#4DC7E8]/10">
            <h2 className="text-[15px] md:text-[18px] font-medium text-[rgba(25,110,150,255)] mb-2">
              {t("hotelDetail.contact")}
            </h2>
            <div className="space-y-2 font-medium text-[15px] md:text-[18px]">
              <p className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-[rgba(25,110,150,255)] mt-0.5" />
                <span>{hotel.address?.[lang]}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[rgba(25,110,150,255)]" />
                <a href={`tel:${hotel.phone?.replace(/[^0-9+]/g, "")}`} className="hover:text-[#4DC7E8]">
                  {hotel.phone}
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <NearHotels hotelId={hotel.id.toString()} />

      {/* ✅ Modal portal */}
      {isModalOpen &&
        <GalleryModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          images={images}
          title={hotel.name}
          />
        }
    </motion.div>
  );
};

export default HotelDetailsPage;
