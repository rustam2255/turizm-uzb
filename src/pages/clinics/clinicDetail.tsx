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
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { openGoogleMaps, openNativeMap, openYandexMaps } from "@/utils/mapnavigate";
import { motion, } from "framer-motion";
import { stripHtmlTags } from "@/utils/getHtmlTags";
import GalleryModal from "@/utils/galleryModal";

import { Helmet } from "react-helmet-async";
const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;

const ClinicDetail: React.FC = () => {
  const { idSlug } = useParams<{ idSlug: string }>();
  const { t, i18n } = useTranslation();
  type Lang = "uz" | "ru" | "en";
  const lang = (i18n.language.split("-")[0] as Lang) || "en";
  const clinicId = Number(idSlug?.split("-")[0]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
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
  const pageTitle = clinic?.name || t("services.clinic");
  
  const pageImage =
    images && images.length > 0 ? `${MEDIA_URL}${images[0].photo}` : IMAGE;

  const keywords = [
    getLocalizedText(clinic?.name, lang),
    
    t("services.clinic"),
  ].join(", ");
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
        className="w-full px-4 md:px-[80px] pt-[100px] bg-gradient-to-b from-white to-[#4DC7E8]/5 min-h-screen"
      >
        <p className="text-center text-red-500 text-[16px] md:text-[18px] font-medium">{t("error.failed_to_load_data")}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full px-4 md:px-[80px] pt-[30px] pb-16 max-w-[1100px] md:ml-5 mx-auto bg-gradient-to-b from-white to-[#4DC7E8]/5 min-h-screen"
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" />
        <meta name="keywords" content={keywords} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description"  />
        <meta property="og:image" content={pageImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description"  />
        <meta name="twitter:image" content={pageImage} />

        {/* Structured Data - JSON-LD */}
        {clinic && clinic.latitude && clinic.longitude && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              name: clinic.name,
              image: pageImage,
              description: 'Descr',
              address: {
                "@type": "PostalAddress",
                addressCountry: "UZ",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: clinic.latitude,
                longitude: clinic.longitude,
              },
              url: window.location.href,
            })}
          </script>
        )}
      </Helmet>
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center text-[14px] md:text-[16px] font-medium gap-2 text-[#131313]"
      >
        <Link to="/" className=" transition-colors duration-200">
          {t("breadcrumb.home")}
        </Link>
        <span className="">&gt;</span>
        <Link to="/services" className=" transition-colors duration-200">
          {t("services.title")}
        </Link>
        <span className="text-[#4DC7E8">&gt;</span>
        <Link to="/services/clinics" className=" transition-colors duration-200">
          {t("services.clinic")}
        </Link>
        <span className="text-[#4DC7E8">&gt;</span>
        <span className="text-[rgba(25,110,150,255)] font-semibold">{clinic.name}</span>
      </motion.div>

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-[24px] md:text-[36px] font-semibold mb-4 text-[#131313]"
      >
        {clinic.name}
      </motion.p>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Image and Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full relative h-[300px] md:h-[450px] overflow-hidden rounded-xl border border-[#4DC7E8]/10 shadow-md shadow-[#4DC7E8]/20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >

            <motion.img
              key={currentImageIndex}
              src={`${MEDIA_URL}${images[currentImageIndex].photo}`}
              alt={clinic.name}
              loading="lazy"
              className="w-full h-full object-cover"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = FallbackImage;
              }}
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
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5 text-[rgba(25,110,150,255)]" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40 transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5 text-[rgba(25,110,150,255)]" />
                </motion.button>
              </>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute bottom-3 right-3 bg-white/80 px-3 py-1 text-sm font-medium text-[rgba(25,110,150,255)] rounded-md shadow-sm shadow-[#4DC7E8]/20"
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
                    className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-[#4DC7E8]' : 'bg-[#4DC7E8]/50'}`}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Address */}


          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-gray-700"
          >

            <p className="text-lg font-semibold mb-2 text-[#131313]">
              {stripHtmlTags(getLocalizedText(normalizeDescription(clinic.description), lang))}
            </p>
          </motion.div>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-gray-700"
          >

            <p className="whitespace-pre-line leading-relaxed">
              {stripHtmlTags(getLocalizedText(normalizeBody(clinic.body), lang))}
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
            <div className="bg-white p-4 rounded-xl shadow-md shadow-[#4DC7E8]/20 border border-[#4DC7E8]/10 sticky top-24">
              <h2 className="text-base md:text-lg font-medium text-[rgba(25,110,150,255)] mb-3">{t("hotelDetail.location_map")}</h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="h-64 lg:h-80 bg-[#4DC7E8]/10 overflow-hidden rounded-md shadow-sm shadow-[#4DC7E8]/20"
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
                    className="flex-1 bg-[rgba(25,110,150,255)] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 rounded text-sm transition-all duration-300 shadow-sm shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40"
                    title="Telefon navigatorida ochish"
                  >
                    📱 Navigator
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openGoogleMaps(clinic.latitude, clinic.longitude, clinic.name)}
                    className="flex-1 bg-[rgba(25,110,150,255)] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 rounded text-sm transition-all duration-300 shadow-sm shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40"
                    title="Google Maps da ochish"
                  >
                    🗺️ Google
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openYandexMaps(clinic.latitude, clinic.longitude)}
                  className="w-full bg-[rgba(25,110,150,255)] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 rounded text-sm transition-all duration-300 shadow-sm shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40"
                  title="Yandex Maps da ochish"
                >
                  🗺️ Yandex Maps
                </motion.button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-gray-700"
              >
                <h3 className="text-lg font-semibold mb-2 text-[#131313]">{t("common.address")}</h3>
                <p className="whitespace-pre-line">{getLocalizedText({
                  uz: clinic.address.address_uz,
                  ru: clinic.address.address_ru,
                  en: clinic.address.address_en
                }, lang)}</p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
      {isModalOpen &&
        <GalleryModal
          isOpen={isModalOpen}
          onClose={closeModal}
          images={images.map(img => ({ id: img.id, image: `${MEDIA_URL}${img.photo}` }))}
          title={clinic.name}
        />
      }
    </motion.div>
  );
};

export default ClinicDetail;