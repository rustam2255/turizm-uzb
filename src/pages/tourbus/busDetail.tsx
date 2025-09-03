import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetBusbyIdQuery } from "@/services/api";
import FallbackImage from "@assets/images/place3.png";
import { getLocalizedText, normalizeAddress, normalizeBody, normalizeDescription } from "@/utils/getLocalized";
import IMAGE from "@assets/images/samarkand-img.png";
import IMAGE1 from "@assets/images/place1.png";
import IMAGE2 from "@assets/images/place3.png";
import HotelDetailsSkeleton from "@/components/ui/loaderSkleton/hotelDetailsSkeleton";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { openGoogleMaps, openNativeMap, openYandexMaps } from "@/utils/mapnavigate";
import { stripHtmlTags } from "@/utils/getHtmlTags";
import GalleryModal from "@/utils/galleryModal";
const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;
import { Helmet } from "react-helmet-async";
const BusDetail: React.FC = () => {
  const { idSlug } = useParams<{ idSlug: string }>();
  const bankId = Number(idSlug?.split("-")[0]);
  const { t, i18n } = useTranslation();
  type Lang = "uz" | "ru" | "en";
  const lang = (i18n.language.split("-")[0] as Lang) || "en";
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const {
    data: bank,
    isLoading,
    isError,
  } = useGetBusbyIdQuery(bankId);
  const mockImage = [IMAGE, IMAGE1, IMAGE2];
  const images =
    bank?.images?.length && bank.images[0].photo
      ? bank.images
      : mockImage.map((img, index) => ({ id: index, photo: img }));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return <HotelDetailsSkeleton />;
  }

  if (isError || !bank) {
    return (
      <div
        className="w-full px-4 md:px-[80px] pt-[100px] bg-gradient-to-b from-white to-[#4DC7E8]/5 min-h-screen"
      >
        <p className="text-center text-red-500 text-[16px] md:text-[18px] font-medium">{t("error.failed_to_load_data")}</p>
      </div>
    );
  }
  const pageTitle = bank ? bank.name : t("services.tourbus");
  const pageDescription = bank
    ? stripHtmlTags(getLocalizedText(normalizeDescription(bank.description), lang)).slice(0, 160)
    : t("services.tourbus_description");

  return (
    <div
      className="w-full px-4 md:px-[80px] pt-[30px] pb-16 max-w-[1250px] md:ml-5 mx-auto bg-gradient-to-b from-white to-[#4DC7E8]/5 min-h-screen"
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={window.location.href} />

        {/* OpenGraph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={bank?.images?.[0]?.photo ? `${MEDIA_URL}${bank.images[0].photo}` : IMAGE} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={bank?.images?.[0]?.photo ? `${MEDIA_URL}${bank.images[0].photo}` : IMAGE} />

        {/* JSON-LD Schema */}
        {bank && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelService",
              "name": bank.name,
              "image": bank.images?.map(img => `${MEDIA_URL}${img.photo}`) || [],
              "description": stripHtmlTags(getLocalizedText(normalizeDescription(bank.description), lang)),
              "address": {
                "@type": "PostalAddress",
                "streetAddress": getLocalizedText(normalizeAddress(bank.address), lang),

                "addressCountry": "UZ"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": bank.latitude,
                "longitude": bank.longitude
              },
              "url": window.location.href
            })}
          </script>
        )}
      </Helmet>
      {/* Breadcrumb */}
      <div
        className="flex items-center text-[14px] md:text-[16px] font-medium gap-2 text-[#131313]"
      >
        <Link to="/" className="hover:text-[#4DC7E8] transition-colors duration-200">{t("breadcrumb.home")}</Link>
        <span className="">&gt;</span>
        <Link to="/services" className=" transition-colors duration-200">{t("services.title")}</Link>
        <span className="text-[#4DC7E8">&gt;</span>
        <Link to="/services/tour-bus" className=" transition-colors duration-200">{t("services.tourbus")}</Link>
        <span className="">&gt;</span>
        <span className="text-[rgba(25,110,150,255)] font-semibold">{bank.name}</span>
      </div>

      {/* Title */}
      <p
        className="text-[24px] md:text-[36px] font-semibold mb-4 text-[#131313]"
      >
        {bank.name}
      </p>

      {/* Main Content Grid */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        {/* Left Column - Image and Information */}
        <div
          className="lg:col-span-2 space-y-6"
        >
          {/* Image */}
          <div
            className="w-full relative h-[300px] md:h-[450px] overflow-hidden  border "
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={`${MEDIA_URL}${images[currentImageIndex].photo}`}
              alt={bank.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FallbackImage;
              }}
              loading="lazy"
            />
            {isHovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/30 "
                onClick={openModal}
              >
                <ZoomIn className="w-10 h-10 text-white bg-[rgba(25,110,150,0.7)] p-2 rounded-full" />
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5 text-[rgba(25,110,150,255)]" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40 transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5 text-[rgba(25,110,150,255)]" />
                </button>
              </>
            )}

            <div
              className="absolute bottom-3 right-3 bg-white/80 px-3 py-1 text-sm font-medium text-[rgba(25,110,150,255)]  shadow-sm shadow-[#4DC7E8]/20"
            >
              {currentImageIndex + 1} {t("hotelDetail.of")} {images.length}
            </div>

            {images.length > 1 && (
              <div
                className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2"
              >
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-[rgba(25,110,150,255)]' : 'bg-[#4DC7E8]/50'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Address */}


          {/* Description */}
          <div
            className="text-gray-700"
          >
            <p className="text-lg font-semibold mb-2 text-[#131313]">
              {getLocalizedText(normalizeDescription(bank.description), lang)}
            </p>
          </div>

          {/* Body */}
          <div
            className="text-gray-700"
          >

            <p className="whitespace-pre-line leading-relaxed">
              {stripHtmlTags(getLocalizedText(normalizeBody(bank.body), lang))}
            </p>
          </div>
        </div>

        {/* Right Column - Map */}
        <div
          className="lg:col-span-1"
        >
          {/* Google Map */}
          {bank.latitude && bank.longitude && (
            <div
              className="bg-white p-4   border sticky top-24"
            >
              <h2
                className="text-base md:text-lg font-medium text-[rgba(25,110,150,255)] mb-3"
              >
                {t("hotelDetail.location_map")}
              </h2>
              <div className="h-64 lg:h-80 bg-[#4DC7E8]/10 overflow-hidden  ">
                <iframe
                  title="map"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${bank.latitude},${bank.longitude}&z=15&output=embed`}
                ></iframe>
              </div>
              <div
                className="flex flex-col gap-2 mb-3 mt-4"
              >
                <div className="flex gap-2">
                  <button
                    onClick={() => openNativeMap(bank.latitude, bank.longitude, bank.name)}
                    className="flex-1 bg-[rgba(25,110,150,255)] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 text-sm transition-all duration-300 shadow-sm shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40"
                  >
                    📱 Navigator
                  </button>
                  <button
                    onClick={() => openGoogleMaps(bank.latitude, bank.longitude, bank.name)}
                    className="flex-1 bg-[rgba(25,110,150,255)] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 text-sm transition-all duration-300 shadow-sm shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40"
                  >
                    🗺️ Google
                  </button>
                </div>
                <button
                  onClick={() => openYandexMaps(bank.latitude, bank.longitude)}
                  className="w-full bg-[rgba(25,110,150,255)] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3  text-sm transition-all duration-300 shadow-sm shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40"
                >
                  🗺️ Yandex Maps
                </button>
              </div>
              <div
                className="text-gray-700"
              >
                <h3 className="text-lg font-semibold mb-2 text-[#131313]">{t("common.address")}</h3>
                <p className="whitespace-pre-line">{(getLocalizedText(normalizeAddress(bank.address), lang))}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen &&
        <GalleryModal
          isOpen={isModalOpen}
          onClose={closeModal}
          images={images.map(img => ({ id: img.id, image: `${MEDIA_URL}${img.photo}` }))}
          title={bank.name}
        />
      }
    </div>
  );
};

export default BusDetail;