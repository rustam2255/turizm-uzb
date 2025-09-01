import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Facebook, Instagram, MapPin, Phone, Users } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useGetBrandListQuery, useGetAboutImageQuery } from '@/services/api';
import PartnersSlider from './slider';
import i18next, { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import place1 from '/images/place1.png'
// Leaflet ikon xatolarini oldini olish
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => string })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const AboutUs: React.FC = () => {
  const [index, setIndex] = useState(0);
  const { data: Brands } = useGetBrandListQuery();
  const { data: Images, isLoading, isError } = useGetAboutImageQuery([void 0]);

  // Images massivini dinamik tarzda yaratish
  const imageList = Images && Array.isArray(Images) ? Images.map((img: { image: string }) => img.image) : [];

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % (imageList.length || 1));
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + (imageList.length || 1)) % (imageList.length || 1));
  };

  const goToSlide = (i: number) => {
    setIndex(i);
  };

  // Toshkent, Yakkasaroy, Qushbegi ko‘chasi 11A koordinatalari
  const position: [number, number] = [41.2995, 69.2401];
  const address = "Toshkent shahar, Yakkasaroy tumani, Qushbegi mavzesi, Qushbegi ko‘chasi 11A";

  // Navigatsiya funksiyalari
  const openGoogleMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  const openYandexMaps = (lat: number, lng: number) => {
    const url = `https://yandex.uz/maps/?rtext=~${lat},${lng}&rtt=auto`;
    window.open(url, '_blank');
  };

  const openNativeMap = (lat: number, lng: number, name: string) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const url = `maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
        window.location.href = url;
      } else {
        const url = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(name)})`;
        window.location.href = url;
      }
    } else {
      openGoogleMaps(lat, lng, name);
    }
  };
  const defaultImage = imageList.length ? imageList[0] : place1 ;
  const currentUrl = `https://sayting.uz/${i18next.language}/about`;
  return (
    <div className="min-h-screen">
      <Helmet>
        {/* HTML til kodi */}
        <html lang={i18next.language} />

        {/* Title & Description */}
        <title>{t("seo.about.title")}</title>
        <meta name="description" content={t("seo.about.description")} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={t("seo.about.title")} />
        <meta property="og:description" content={t("seo.about.description")} />
        <meta property="og:image" content={defaultImage} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("seo.about.title")} />
        <meta name="twitter:description" content={t("seo.about.description")} />
        <meta name="twitter:image" content={defaultImage} />

      

        {/* Canonical */}
        <link rel="canonical" href={currentUrl} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-6 py-5">
        {/* Slayder */}
        <div className="relative w-full mx-auto mb-8 overflow-hidden shadow-lg">
          {isLoading ? (
            <div className="flex justify-center items-center h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-blue-600 text-lg font-medium">Yuklanmoqda...</span>
            </div>
          ) : isError || !imageList.length ? (
            <div className="flex justify-center items-center h-[60vh]">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-500 text-lg font-medium">Rasm yuklashda xatolik!</div>
                <p className="text-red-400 text-sm mt-2">Iltimos, qaytadan urinib ko'ring</p>
              </div>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.img
                  key={index}
                  src={imageList[index]}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-[60vh] object-cover"

                />
              </AnimatePresence>

              {/* Prev button */}
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
              >
                <ChevronLeft />
              </button>

              {/* Next button */}
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
              >
                <ChevronRight />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {imageList.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/50"} transition-all duration-300`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Matnli qism */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="md:text-3xl text-sm font-bold text-[rgba(25,110,150,255)] mb-4">{t("about.title")}</h2>
            <div className="prose prose-lg text-gray-700 mb-4 space-y-6">
              <p className="text-sm leading-relaxed">
                <strong>TOURISM UZBEKISTAN </strong>{t("about.description")}
              </p>
              <p className="leading-relaxed">
                {t("about.body")}
              </p>
            </div>
            <h2 className="text-sm md:text-3xl text-[rgba(25,110,150,255)] font-bold mb-3">{t("about.whywe")}</h2>
            <p className="text-sm max-w-3xl mx-auto leading-relaxed">
              {t("about.whydescr")}
            </p>
          </div>
          <div className="mt-0 md:mt-8">
            <h2 className="md:text-3xl text-sm font-bold text-[rgba(25,110,150,255)] mb-4">{t("about.address")}</h2>
            <div className="w-full h-[400px] overflow-hidden shadow-lg">
              <MapContainer
                center={position}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    <div className="p-2 w-64">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openNativeMap(position[0], position[1], address)}
                            className="flex-1 bg-[rgba(25,110,150,255)] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                            title="Telefon navigatorida ochish"
                          >
                            📱 Navigator
                          </button>
                          <button
                            onClick={() => openGoogleMaps(position[0], position[1], address)}
                            className="flex-1 bg-[rgba(25,110,150,255)] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                            title="Google Maps da ochish"
                          >
                            🗺️ Google
                          </button>
                        </div>
                        <button
                          onClick={() => openYandexMaps(position[0], position[1])}
                          className="w-full bg-[rgba(25,110,150,255)] hover:bg-[#3AA8C7] text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                          title="Yandex Maps da ochish"
                        >
                          🗺️ Yandex Maps
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>

        <div>
          <h4 className='md:text-3xl text-sm font-bold md:text-center mt-4 text-[rgba(25,110,150,255)]'>{t("about.partner")}</h4>
          <PartnersSlider brands={Brands} />
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className='flex justify-between items-stretch gap-6 flex-wrap lg:flex-nowrap'>
            {/* Marketing Bo'limi */}
            <div className='bg-white border border-gray-200 shadow-lg rounded-2xl p-8 w-full lg:w-[300px] flex flex-col justify-center items-center h-[280px] hover:shadow-xl transition-shadow duration-300'>
              <div className='w-16 h-16 bg-sky-900 flex items-center justify-center mb-6'>
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h4 className='text-xl font-bold text-gray-900 mb-4 text-center'>{t("about.marketing")}</h4>
              <div className='space-y-2 text-center'>
                <p className='text-blue-600 font-medium hover:text-blue-800 cursor-pointer transition-colors'>
                  +998 77 480 00 12
                </p>
                <p className='text-blue-600 font-medium hover:text-blue-800 cursor-pointer transition-colors'>
                  +998 77 340 77 73
                </p>
                <p className='text-blue-600 font-medium hover:text-blue-800 cursor-pointer transition-colors'>
                  +998 97 700 02 78
                </p>
              </div>
            </div>

            {/* Manzil */}
            <div className='bg-white border border-gray-200 shadow-lg items-center rounded-2xl p-8 w-full lg:w-[450px] flex flex-col justify-center h-[280px] hover:shadow-xl transition-shadow duration-300'>
              <div className='w-16 h-16 bg-sky-900 flex items-center justify-center mb-6'>
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h4 className='text-xl font-bold text-gray-900 mb-4'>{t("about.addresss")}</h4>
              <p className='text-gray-700 leading-relaxed text-center'>
                {t("about.add")}
              </p>
              <p className='text-blue-600 font-medium mt-3'>
                {t("about.tel")}: +998 97 700 02 78
              </p>
            </div>

            {/* Ijtimoiy tarmoqlar */}
            <div className='bg-white border border-gray-200 shadow-lg rounded-2xl p-8 w-full lg:w-[300px] flex flex-col justify-center items-center h-[280px] hover:shadow-xl transition-shadow duration-300'>
              <div className='w-16 h-16 bg-sky-900 flex items-center justify-center mb-6'>
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className='text-xl font-bold text-gray-900 mb-6 text-center'>{t("about.set")}</h4>
              <div className='flex space-x-4'>
                <a
                  href="#"
                  className='w-14 h-14 bg-sky-500 flex items-center justify-center hover:scale-110 transition-transform duration-300 group shadow-lg'
                >
                  <Instagram className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
                </a>
                <a
                  href="#"
                  className='w-14 h-14 bg-sky-500 flex items-center justify-center hover:scale-110 transition-transform duration-300 group shadow-lg'
                >
                  <Facebook className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;