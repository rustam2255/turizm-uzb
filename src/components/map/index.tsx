import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Helmet } from 'react-helmet-async';
import IMAGE1 from "@assets/images/hotel113.jpg";
import IMAGE2 from "@assets/images/hotel12.jpg";
import IMAGE3 from "@assets/images/hotel124.jpg";

import { Link, useNavigate } from 'react-router-dom';
import UserLocationMarker from './userLocationMarker';
import { useTranslation } from 'react-i18next';
import {
  useGetHotelsMapQuery,
  useGetBanksMapQuery,
  useGetShopsMapQuery,
  useGetClinicsMapQuery,
  useGetResortsMapQuery,
  useGetToursMapQuery
} from "@/services/api";

// TypeScript xatoni oldini olish uchun type-safe workaround
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => string })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type APIMapPoint = {
  id: number;
  name: string;
  position: [number, number];
  description: {
    uz: string;
    en: string;
    ru: string;
  };
  city: {
    uz: string;
    en: string;
    ru: string;
  };
  images?: string | {
    id: number;
    photo: string;
  }[];
};

// Har xil marker turlari uchun ranglar
const MARKER_COLORS = {
  hotel: '#FF5733',
  bank: '#3366CC',
  shop: '#33CC66',
  clinic: '#9933CC',
  resort: '#FF33A8',
  tour: '#FF9900'
};

// Skeleton Component
const MapSkeleton: React.FC = () => {
  return (
    <div className="max-w-[1800px] px-4 py-5 md:py-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-5">
        <div className="h-4 w-20 bg-gray-300 rounded"></div>
        <div className="h-4 w-4 bg-gray-300 rounded"></div>
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
      </div>

      {/* Title Skeleton */}
      <div className="h-8 w-64 bg-gray-300 rounded mb-3 md:mb-[14px]"></div>

      {/* Statistics Skeleton */}
      <div className="mb-4 flex flex-wrap gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>



      {/* Map Skeleton */}
      <div className="w-full h-[535px] bg-gray-300 rounded-lg shadow-lg"></div>
      {/* Navigation Tips Skeleton */}
      <div className="mb-4 p-3 bg-gray-100 rounded-lg">
        <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-full bg-gray-300 rounded mb-1"></div>
        <div className="ml-4">
          <div className="h-4 w-48 bg-gray-300 rounded mb-1"></div>
          <div className="h-4 w-48 bg-gray-300 rounded mb-1"></div>
          <div className="h-4 w-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center text-[14px] font-medium md:text-[18px] gap-2">
      <Link to="/" className="hover:underline text-black dark:text-white">{t("breadcrumb.home")}</Link>
      <span className="text-black dark:text-white">&gt;</span>
      <span className="" style={{ color: 'rgba(25,110,150,255)' }}>{t("map.breadcrumb")}</span>
    </div>
  );
};

const Map: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0] as "uz" | "ru" | "en";
  const navigate = useNavigate();
  // SEO meta
  const metaTitle = t("map.title") || "O‘zbekiston interaktiv xarita";
  const metaDescription = t("map.description") || "O‘zbekiston mehmonxonalar, banklar, bozorlari, klinikalar, kurortlar va sayohat markerlari bilan interaktiv xarita.";
  const metaKeywords = [
    "O‘zbekiston xarita", "Uzbekistan map", "interactive map Uzbekistan",
    "hotels Uzbekistan", "banks Uzbekistan", "clinics Uzbekistan",
    "resorts Uzbekistan", "tours Uzbekistan", "shops Uzbekistan"
  ].join(", ");

  // Barcha API'larni chaqirish
  const { data: hotels = [], isLoading: hotelsLoading, isError: hotelsError } = useGetHotelsMapQuery();
  const { data: banks = [], isLoading: banksLoading, isError: banksError } = useGetBanksMapQuery();
  const { data: shops = [], isLoading: shopsLoading, isError: shopsError } = useGetShopsMapQuery();
  const { data: clinics = [], isLoading: clinicsLoading, isError: clinicsError } = useGetClinicsMapQuery();
  const { data: resorts = [], isLoading: resortsLoading, isError: resortsError } = useGetResortsMapQuery();
  const { data: tours = [], isLoading: toursLoading, isError: toursError } = useGetToursMapQuery();

  // Navigatsionniy funksya
  const openGoogleMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  const openYandexMaps = (lat: number, lng: number) => {
    const url = `https://yandex.uz/maps/?rtext=~${lat},${lng}&rtt=auto`;
    window.open(url, '_blank');
  };

  // Mobil qurilmalarda native map dasturini ochish
  const openNativeMap = (lat: number, lng: number, name: string) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      // iOS uchun Apple Maps
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const url = `maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
        window.location.href = url;
      } else {
        // Android uchun Google Maps
        const url = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(name)})`;
        window.location.href = url;
      }
    } else {
      // Desktop'da Google Maps ochish
      openGoogleMaps(lat, lng, name);
    }
  };

  const handleDetail = (id: number, type: string) => {
    const routes = {
      hotel: `/hotels/${id}`,
      bank: `/services/bank/${id}`,
      shop: `/services/shop/${id}`,
      clinic: `/services/clinic/${id}`,
      resort: `/services/resort/${id}`,
      tour: `/services/tour/${id}`
    };
    navigate(routes[type as keyof typeof routes] || `/hotels/${id}`);
  };

  const getLocalizedText = (
    field: { uz?: string; en?: string; ru?: string } | undefined
  ): string => {
    if (!field) return "";
    return field[currentLang] || field.en || "";
  };

  const fallbackImages = [IMAGE1, IMAGE2, IMAGE3];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    target.src = fallbackImages[randomIndex];
  };

  // Custom marker yaratish
  const createCustomIcon = (color: string) => {
    return new L.DivIcon({
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background-color: ${color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
      className: 'custom-marker'
    });
  };

  // Marker render qilish
  const renderMarkers = (items: APIMapPoint[], type: string, color: string) => {
    return items.map((item) => {
      // Position tekshirish
      if (!item.position || !Array.isArray(item.position) || item.position.length !== 2) {
        console.warn(`Invalid position for ${type} ${item.id}:`, item);
        return null;
      }

      const [lat, lng] = item.position;

      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        console.warn(`Invalid coordinates for ${type} ${item.id}:`, { lat, lng });
        return null;
      }

      const icon = createCustomIcon(color);

      return (
        <Marker key={`${type}-${item.id}`} position={[lat, lng]} icon={icon}>
          <Popup>
            <div className="rounded overflow-hidden shadow-lg bg-white w-72">
              <img
                src={
                  typeof item.images === "string"
                    ? item.images // agar string bo'lsa to'g'ridan-to'g'ri qo'yamiz
                    : item.images && item.images.length > 0
                      ? `${MEDIA_URL}${item.images[0].photo}` // array bo'lsa birinchi rasmi
                      : "/placeholder.png" // fallback rasm
                }
                alt={item.name}
                className="w-full h-32 object-cover"
                onError={handleImageError}
              />

              <div className="p-4">
                <h2 className="font-bold text-lg mb-2">{item.name}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  {getLocalizedText(item.description)}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  📍 {getLocalizedText(item.city)}
                </p>

                {/* Navigatsiya tugmalari */}
                <div className="flex flex-col gap-2 mb-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openNativeMap(lat, lng, item.name)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                      title="Telefon navigatorida ochish"
                    >
                      📱 Navigator
                    </button>
                    <button
                      onClick={() => openGoogleMaps(lat, lng, item.name)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                      title="Google Maps da ochish"
                    >
                      🗺️ Google
                    </button>
                  </div>
                  <button
                    onClick={() => openYandexMaps(lat, lng)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-200"
                    title="Yandex Maps da ochish"
                  >
                    🗺️ Yandex Maps
                  </button>
                </div>

                {/* Batafsil ma'lumot tugmasi */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDetail(item.id, type)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded transition duration-200"
                  >
                    {t("map.viewButton")}
                  </button>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      );
    }).filter(Boolean);
  };

  // Loading holati
  const isLoading = hotelsLoading || banksLoading || shopsLoading ||
    clinicsLoading || resortsLoading || toursLoading;

  // Error holati
  const hasError = hotelsError || banksError || shopsError ||
    clinicsError || resortsError || toursError;

  const tashkentBounds: [[number, number], [number, number]] = [
    [41.2, 69.15], // janubi-g‘arbiy
    [41.4, 69.4],  // shimoli-sharqiy
  ];

  if (isLoading) {
    return <MapSkeleton />;
  }

  if (hasError) {
    return (
      <div className="max-w-[1800px] px-4 py-5 md:py-8">
        <Breadcrumb />
        <div className="text-center text-red-500 py-8">
          {t("error_loading") || "Xatolik yuz berdi"}
        </div>
      </div>
    );
  }

  return (
    <div className=" px-4 py-5 md:py-8">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <link rel="canonical" href={window.location.href} />

        {/* Open Graph */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />

        {/* Structured Data JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Map",
            "name": metaTitle,
            "description": metaDescription,
            "hasMap": {
              "@type": "Map",
              "mapType": "interactive",
              "url": window.location.href,
              "marker": [
                ...hotels.map(h => ({ "@type": "Place", "name": h.name, "geo": { "@type": "GeoCoordinates", "latitude": h.position[0], "longitude": h.position[1] } })),
                ...banks.map(b => ({ "@type": "Place", "name": b.name, "geo": { "@type": "GeoCoordinates", "latitude": b.position[0], "longitude": b.position[1] } })),
                ...shops.map(s => ({ "@type": "Place", "name": s.name, "geo": { "@type": "GeoCoordinates", "latitude": s.position[0], "longitude": s.position[1] } })),
                ...clinics.map(c => ({ "@type": "Place", "name": c.name, "geo": { "@type": "GeoCoordinates", "latitude": c.position[0], "longitude": c.position[1] } })),
                ...resorts.map(r => ({ "@type": "Place", "name": r.name, "geo": { "@type": "GeoCoordinates", "latitude": r.position[0], "longitude": r.position[1] } })),
                ...tours.map(t => ({ "@type": "Place", "name": t.name, "geo": { "@type": "GeoCoordinates", "latitude": t.position[0], "longitude": t.position[1] } }))
              ]
            }
          })}
        </script>
      </Helmet>
      <Breadcrumb />


      {/* Statistika */}
      <div className="mb-4 flex mt-5 flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MARKER_COLORS.hotel }}></div>
          {t('services.hotels')}: {hotels.length}
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MARKER_COLORS.bank }}></div>
          {t('services.banks')}: {banks.length}
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MARKER_COLORS.shop }}></div>
          {t('services.market')}: {shops.length}
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MARKER_COLORS.clinic }}></div>
          {t('services.clinic')}: {clinics.length}
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MARKER_COLORS.resort }}></div>
          {t('services.resort')}: {resorts.length}
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: MARKER_COLORS.tour }}></div>
          {t('services.tour-firm')}: {tours.length}
        </span>
      </div>



      <div className="w-full h-[72vh] rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          bounds={tashkentBounds}
          maxBounds={tashkentBounds}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={true}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='© <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <UserLocationMarker />

          {/* Test marker */}
          <Marker position={[41.31, 69.28]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">Test Marker</h3>
                <p>Bu test marker</p>
              </div>
            </Popup>
          </Marker>

          {/* Barcha markerlar */}
          {renderMarkers(hotels, 'hotel', MARKER_COLORS.hotel)}
          {renderMarkers(banks, 'bank', MARKER_COLORS.bank)}
          {renderMarkers(shops, 'shop', MARKER_COLORS.shop)}
          {renderMarkers(clinics, 'clinic', MARKER_COLORS.clinic)}
          {renderMarkers(resorts, 'resort', MARKER_COLORS.resort)}
          {renderMarkers(tours, 'tour', MARKER_COLORS.tour)}
        </MapContainer>
      </div>
      {/* Navigatsiya haqida ma'lumot */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
        💡 <strong>{t("tips.tip")}</strong> {t('navigation.tip')}
        <ul className="mt-1 ml-4 list-disc">
          <li><strong>{t("tips.navigation")}</strong>{t('navigation.navigator')}</li>
          <li><strong>{t("tips.google")}</strong>{t('navigation.google')}</li>
          <li><strong>{t("tips.yandex")}</strong> {t('navigation.yandex')}</li>
        </ul>
      </div>
    </div>
  );
};

export default Map;