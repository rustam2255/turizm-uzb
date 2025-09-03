import React, { useState } from "react";
import { Link } from "react-router-dom";

import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getLocalizedText } from "@/utils/getLocalized";
import { openGoogleMaps, openNativeMap, openYandexMaps } from "@/utils/mapnavigate";
import { stripHtmlTags } from "@/utils/getHtmlTags";
import GalleryModal from "@/utils/galleryModal";
const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;
import { Helmet } from "react-helmet-async";
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
  description: MultilangText;
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const descriptionText = stripHtmlTags(getLocalizedText(place.description, lang));
  
  return (
    <div
      className="w-full px-4 md:px-[80px] pt-[50px] pb-16 max-w-[1250px] md:ml-5 mx-auto bg-gradient-to-b from-white to-[#4DC7E8]/5 min-h-screen"
    >
      <Helmet>
        <title>{place.name} | Uzbekistan Tours</title>
        <meta name="description" content={descriptionText.substring(0, 160)} />
        <meta name="keywords" content={`travel, tour, Uzbekistan, ${place.name}`} />
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={`${place.name} | Uzbekistan Tours`} />
        <meta property="og:description" content={descriptionText.substring(0, 160)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={images[0] ? `${MEDIA_URL}${images[0].photo}` : ""} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${place.name} | Uzbekistan Tours`} />
        <meta name="twitter:description" content={descriptionText.substring(0, 160)} />
        <meta name="twitter:image" content={images[0] ? `${MEDIA_URL}${images[0].photo}` : ""} />
      </Helmet>
      {/* Breadcrumb */}
      <div
        className="flex items-center text-[14px] md:text-[16px] font-medium gap-2 text-[#131313]"
      >
        <Link to="/" className="hover:text-[#4DC7E8] transition-colors duration-200">{t("breadcrumb.home")}</Link>
        <span className="">&gt;</span>
        <Link to="/services" className=" transition-colors duration-200">{t("services.title")}</Link>
        <span className="">&gt;</span>
        <Link to="/services/tours" className=" transition-colors duration-200">{t("services.tour-firm")}</Link>
        <span className="">&gt;</span>
        <span className="text-[rgba(25,110,150,255)] font-semibold">{place.name}</span>
      </div>

      <div
        className="mt-3 md:mt-5"
      >
        <p
          className="text-[24px] md:text-[36px] text-[#131313] leading-[100%] mb-1 font-semibold"
        >
          {place.name}
        </p>

        <div
          className="flex flex-row items-center mb-3 md:mb-4"
        >

        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <div
            className="lg:col-span-2 space-y-6"
          >
            {/* Image */}
            <div
              className="w-full relative h-[300px] md:h-[450px] overflow-hidden  border"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={`${MEDIA_URL}${images[currentImageIndex].photo}`}
                alt={place.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {isHovered && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/30"
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
                className="absolute bottom-3 right-3 bg-white/80 px-3 py-1 text-sm font-medium text-[rgba(25,110,150,255)] rounded-md shadow-sm shadow-[#4DC7E8]/20"
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



            {/* Body */}
            <div
              className="text-gray-700"
            >
              <h3 className="text-lg font-semibold mb-2 text-[#131313]">{getLocalizedText(place.description, lang)}</h3>
              <p className="whitespace-pre-line leading-relaxed">
                {stripHtmlTags(getLocalizedText(place.body, lang))}
              </p>
            </div>
          </div>

          {/* Right Column - Map */}
          <div
            className="lg:col-span-1"
          >
            {/* Google Map */}
            {place.latitude && place.longitude && (
              <div
                className="bg-white p-4   border  sticky top-24"
              >
                <h2
                  className="text-base md:text-lg font-medium text-[rgba(25,110,150,255)] mb-3"
                >
                  {t("hotelDetail.location_map")}
                </h2>
                <div className="h-64 lg:h-80 bg-[#4DC7E8]/10 overflow-hidden">
                  <iframe
                    title="map"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${place.latitude},${place.longitude}&z=15&output=embed`}
                  ></iframe>
                </div>
                <div
                  className="flex flex-col gap-2 mb-3 mt-4"
                >
                  <div className="flex gap-2">
                    <button
                      onClick={() => openNativeMap(place.latitude, place.longitude, place.name)}
                      className="flex-1 bg-[rgba(25,110,150,255)] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3  text-sm transition-all duration-300  hover:shadow-[#4DC7E8]/40"
                    >
                      📱 Navigator
                    </button>
                    <button
                      onClick={() => openGoogleMaps(place.latitude, place.longitude, place.name)}
                      className="flex-1 bg-[rgba(25,110,150,255)] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 text-sm transition-all duration-30 hover:shadow-[#4DC7E8]/40"
                    >
                      🗺️ Google
                    </button>
                  </div>
                  <button
                    onClick={() => openYandexMaps(place.latitude, place.longitude)}
                    className="w-full bg-[rgba(25,110,150,255)] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 text-sm transition-all duration-300  hover:shadow-[#4DC7E8]/40"
                  >
                    🗺️ Yandex Maps
                  </button>
                </div>
                <div
                  className="text-gray-700 "
                >
                  <h3 className="text-lg font-semibold mb-2 text-[#131313]">{t("common.address")}</h3>
                  <p className="whitespace-pre-line">{getLocalizedText(place.address, lang)}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      {isModalOpen &&
        <GalleryModal
          isOpen={isModalOpen}
          onClose={closeModal}
          images={images.map(img => ({ id: img.id, image: `${MEDIA_URL}${img.photo}` }))}
          title={place.name}
        />
      }
    </div>
  );
};

export default TravelPlaceDetail;