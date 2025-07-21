import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { MapPin, Phone, Award, ChevronLeft, ChevronRight } from "lucide-react";
import HotelDetailsSkeleton from "@/components/ui/loaderSkleton/hotelDetailsSkeleton";
import NearHotels from "@/components/nearHotels";
import IMAGE from "@assets/images/samarkand-img.png";
import IMAGE1 from "@assets/images/place1.png";
import IMAGE2 from "@assets/images/place3.png"
import { useGetHotelByIdQuery } from "@/services/api";
import { openGoogleMaps, openNativeMap, openYandexMaps } from "@/utils/mapnavigate";


const HotelDetailsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { idSlug } = useParams<{ idSlug: string }>();


  const hotelId = Number(idSlug?.split("-")[0]);
  const mockImage = [
    IMAGE, IMAGE1, IMAGE2
  ]
  const supportedLangs = ["uz", "ru", "en"];
  const lang = supportedLangs.includes(i18n.language) ? i18n.language : "en";

  const { data: hotel, isLoading, isError } = useGetHotelByIdQuery(hotelId!, {
    skip: !hotelId,
  });

  const images = hotel?.images?.length ? hotel.images : mockImage;
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
    <div className="max-w-7xl mx-auto py-5 md:py-7.5">
      <div className="flex items-center text-[14px] font-medium md:text-[18px] gap-2">
        <Link to="/" className="hover:underline text-black">{t("breadcrumb.home")}</Link>
        <span className="text-black">&gt;</span>
        <span className="text-[#DE5D26]">{t("breadcrumb.hotels")}</span>
      </div>

      <h1 className="text-[20px] font-serif md:text-[24px] text-black leading-[100%] mb-2 mt-4 md:mt-5 md:mb-5">{hotel.name}</h1>

      <div className="grid grid-cols-1 font-serif lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative mb-3 md:mb-5">
            <img
              src={images[currentImageIndex]}
              alt={hotel.name}
              className="w-full h-80 object-cover object-center"
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
            <h3 className="text-lg font-semibold mb-2">{t("common.description")}</h3>
            <p className="whitespace-pre-line leading-relaxed">
              {hotel.description?.[lang]}
            </p>
          </div>
          <div className="text-gray-700">
            <h3 className="text-lg font-semibold mb-2">{t("common.details")}</h3>
            <p className="whitespace-pre-line leading-relaxed">
              {hotel.body?.[lang]}
            </p>
          </div>




        </div>

        <div className="lg:col-span-1">
          <div className="bg-white mb-4">
            <h2 className="text-[20px] md:text-[24px] text-[#DE5D26] mb-4">{t("hotelDetail.amenities")}</h2>
            <ul className="space-y-3">
              {hotel.amenities.length > 0 ? (
                hotel.amenities.map((amenity) => (
                  <li key={amenity.id} className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-black" />
                    <p className="text-[14px] font-medium leading-[26px] md:text-[18px]">
                      {amenity.name[lang]}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">{t("no_amenities")}</p>
              )}
            </ul>
          </div>

          <div className="bg-white">
            <h2 className="text-[15px] md:text-[18px] font-medium text-[#DE5D26] mb-1">{t("hotelDetail.location_map")}</h2>
            <div className="h-64 bg-gray-200 overflow-hidden">
              <iframe
                title="map"
                width="100%"
                height="100%"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`}
              ></iframe>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => openNativeMap(hotel.latitude, hotel.longitude, hotel.name)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                  title="Telefon navigatorida ochish"
                >
                  📱 Navigator
                </button>
                <button
                  onClick={() => openGoogleMaps(hotel.latitude, hotel.longitude, hotel.name)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                  title="Google Maps da ochish"
                >
                  🗺️ Google
                </button>
              </div>
              <button
                onClick={() => openYandexMaps(hotel.latitude, hotel.longitude)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                title="Yandex Maps da ochish"
              >
                🗺️ Yandex Maps
              </button>
            </div>


          </div>

          <div className="bg-white mt-2 md:mt-4">
            <h2 className="text-[15px] md:text-[18px] font-medium text-[#DE5D26] mb-2">{t("hotelDetail.contact")}</h2>
            <div className="space-y-2 font-medium text-[15px] md:text-[18px]">
              <h3 className="text-lg font-semibold mb-2">{t("common.address")}</h3>
              <p className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-black mt-0.5" />
                <span>{hotel.address?.[lang]}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-black" />
                <a
                  href={`tel:${hotel.phone?.replace(/[^0-9+]/g, "")}`}
                  className="hover:underline"
                >
                  {hotel.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <NearHotels hotelId={hotel.id.toString()} />
    </div>
  );
};

export default HotelDetailsPage;