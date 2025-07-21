import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useGetShopsQuery, useGetCitiesHotelQuery } from "@/services/api";
import SkeletonCard from "@/components/ui/loaderSkleton/travelDestinationSkleton";
import IMAGE from '@/assets/images/market.png';
import IMAGE1 from '@assets/images/place1.png'
import { MapPin } from "lucide-react";
import { slugify } from "@/utils/slugify";

type Lang = "uz" | "ru" | "en";
interface MarketCity {
  id: number;
  name: string | Record<Lang, string>;
}
const getLocalizedText = (
  text: string | Record<Lang, string> | undefined,
  lang: Lang
): string => {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[lang] || text.en || "";
};
const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2">
      <Link to="/" className="hover:underline text-black">
        {t("breadcrumb.home")}
      </Link>
      <span className="text-black">&gt;</span>
      <Link to="/services">
        <span className="text-[#DE5D26]">{t("services.title")}</span>
      </Link>
      <span className="text-black">&gt;</span>
      <span className="text-blue-600">{t("services.market")}</span>
    </div>
  );
};

interface marketCardProps {
  market: dataMarket;
  lang: Lang;
}

const MarketCard: React.FC<marketCardProps> = ({ market, lang }) => {
     const firstImage =
    market.images && market.images.length > 0 ? market.images[0] : IMAGE;

  const secondImage =
    market.images && market.images.length > 1 ? market.images[1] : IMAGE1;
  
  const navigate = useNavigate()

  return (
    <div
      className="flex flex-col p-3 hover:scale-105 transition h-full cursor-pointer"
      onClick={() => navigate(`/services/shop/${market.id}-${slugify(market.name)}`)}
    >
      <div className="relative h-48 overflow-hidden mb-3 rounded group" style={{ perspective: '1000px' }}>
        {/* Container for 3D flip effect */}
        <div className="w-full h-full transition-transform duration-700 ease-in-out transform-gpu group-hover:[transform:rotateY(180deg)]" style={{ transformStyle: 'preserve-3d' }}>

          {/* Front Image */}
          <img
            src={firstImage}
            alt={market.name}
            className="w-full h-full object-cover absolute top-0 left-0"
            style={{ backfaceVisibility: 'hidden' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMAGE;
            }}
          />

          {/* Back Image */}
          <img
            src={secondImage}
            alt={market.name}
            className="w-full h-full object-cover absolute top-0 left-0"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMAGE1;
            }}
          />

        </div>
      </div>
      <h2 className="text-lg font-semibold mb-2 line-clamp-2">{market.name}</h2>
      <div className="flex items-center gap-1 text-gray-500 text-sm mt-auto pt-2 border-t border-gray-100">
        <MapPin size={16} className="mr-1" />
        <span className="truncate">{getLocalizedText({
          uz: market.city.name_uz,
          ru: market.city.name_ru,
          en: market.city.name_en,
        },
          lang)}</span>
      </div>
    </div>
  );
};

export interface MultilangText {
  name_uz: string;
  name_ru: string;
  name_en: string;
}

interface dataMarket {
  id: number;
  name: string;
  city: MultilangText;
  latitude: number;
  longitude: number;
  images: string[];
}

const Market = () => {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language.split("-")[0] as Lang) || "en";
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: cities = [],
    isLoading: loadingCities,
    isError: errorCities,
  } = useGetCitiesHotelQuery();
  const { data: dataMarkets, isLoading: marketIsLoading, isError: Errormarket } = useGetShopsQuery({
    page: currentPage,
    search: searchQuery || undefined,
    city: selectedCity || undefined,
  });
  const dataMarket: dataMarket[] = dataMarkets?.results || [];
  const totalPages = Math.ceil((dataMarkets?.count || 0) / 10);
  const isLoading = loadingCities || marketIsLoading

  if (Errormarket || !dataMarkets || errorCities) return <p className="text-center text-red-500">{t("error.failed_to_load_data")}</p>;

  return (
    <div className="w-full py-6 pt-[80px] md:pt-[100px]">
      <div className="max-w-[1400px] xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        <Breadcrumb />
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif mb-4 sm:mb-6">{t("services.market")}</h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder={t("placeholder.market")}
            className="border border-gray-300 px-3 py-2 rounded w-full sm:w-1/2"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            onChange={(e) => {
              setSelectedCity(String(e.target.value) || null);
              setCurrentPage(1);
            }}
            value={selectedCity || ""}
            className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/3 text-sm"
          >
            <option value="">{t("travel.select_city")}</option>
            {cities.map((city: MarketCity) => (
              <option key={city.id} value={city.id}>
                {getLocalizedText(city.name, lang)}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : dataMarket.map((market) => (
              <MarketCard key={market.id} market={market} lang={lang} />
            ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 flex-wrap gap-2 px-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded text-sm sm:text-base transition-colors duration-200 ${currentPage === page
                ? "bg-[#DE5D26] text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Market;
