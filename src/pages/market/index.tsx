import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import { useGetShopsQuery, useGetCitiesHotelQuery } from "@/services/api";
import SkeletonCard from "@/components/ui/loaderSkleton/travelDestinationSkleton";
import IMAGE from '@/assets/images/market.png';
import IMAGE1 from '@assets/images/place1.png';
import { MapPin } from "lucide-react";
import { slugify } from "@/utils/slugify";

const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL;

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
    <div className="flex items-center text-[14px] md:text-[16px] font-medium gap-2 text-[#131313] animate-slide-in-left">
      <Link to="/" className="hover:text-[#4DC7E8] transition-colors duration-200">
        {t("breadcrumb.home")}
      </Link>
      <span className="text-[#4DC7E8]">&gt;</span>
      <Link to="/services" className="hover:text-[#4DC7E8] transition-colors duration-200">
        <span>{t("services.title")}</span>
      </Link>
      <span className="text-[#4DC7E8]">&gt;</span>
      <span className="text-[#4DC7E8] font-semibold">{t("services.market")}</span>
    </div>
  );
};

interface marketCardProps {
  market: dataMarket;
  lang: Lang;
  index: number;
}

const MarketCard: React.FC<marketCardProps> = ({ market, lang, index }) => {
  const firstImage =
    market.images && market.images.length > 0 ? `${MEDIA_URL}${market.images[0].photo}` : IMAGE;
  const secondImage =
    market.images && market.images.length > 1 ? `${MEDIA_URL}${market.images[1].photo}` : IMAGE1;
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col w-full h-[300px] md:h-[300px] bg-white rounded-xl shadow-md shadow-[#4DC7E8]/20 hover:shadow-[#4DC7E8]/40 transition-shadow duration-300 border border-[#4DC7E8]/10 overflow-hidden cursor-pointer animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => navigate(`/services/shop/${market.id}-${slugify(market.name)}`)}
    >
      <div
        className="relative h-[160px] md:h-[200px] overflow-hidden mb-3 rounded-t-xl group"
        style={{ perspective: '1000px' }}
      >
        <div
          className="w-full h-full transition-transform duration-700 ease-in-out transform-gpu group-hover:[transform:rotateY(180deg)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <img
            src={firstImage}
            alt={market.name}
            className="w-full h-full object-cover absolute top-0 left-0 rounded-t-xl"
            style={{ backfaceVisibility: 'hidden' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-[#4DC7E8]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
          <img
            src={secondImage}
            alt={market.name}
            className="w-full h-full object-cover absolute top-0 left-0 rounded-t-xl"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMAGE1;
            }}
          />
        </div>
      </div>
      <div className="flex flex-col flex-grow p-4">
        <h2 className="text-[16px] md:text-[20px] font-semibold mb-2 line-clamp-2 text-[#131313] animate-fade-in">{market.name}</h2>
        <div className="flex items-center gap-1 text-gray-500 text-[14px] md:text-[15px] mt-auto pt-2 border-t border-[#4DC7E8]/10 animate-fade-in">
          <MapPin size={16} className="text-[#4DC7E8] mr-1" />
          <span className="truncate">{getLocalizedText({
            uz: market.city.name_uz,
            ru: market.city.name_ru,
            en: market.city.name_en,
          }, lang)}</span>
        </div>
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
  images: {
    id: number;
    photo: string;
  }[];
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


const dataMarket: dataMarket[] = useMemo(() => {
  return dataMarkets?.results || [];
}, [dataMarkets]);

const totalPages = Math.ceil((dataMarkets?.count || 0) / 10);
const isLoading = loadingCities || marketIsLoading;

useEffect(() => {
  const elements = document.querySelectorAll('.animate-slide-up, .animate-slide-in-left, .animate-slide-in-right, .animate-fade-in');
  elements.forEach((el, index) => {
    el.classList.add('opacity-0');
    setTimeout(() => {
      el.classList.remove('opacity-0');
    }, index * 100);
  });
}, [dataMarket]);

if (Errormarket || !dataMarkets || errorCities) return (
  <p className="text-center text-red-500 text-[16px] md:text-[18px] font-medium animate-fade-in">{t("error.failed_to_load_data")}</p>
);

return (
  <div className="w-full py-6 pt-[80px] md:pt-[30px] bg-gradient-to-b from-white to-[#4DC7E8]/5 min-h-screen">
    <div className="max-w-[1800px] xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 lg:px-0">
      <Breadcrumb />
      <h1 className="text-[20px] sm:text-[24px] md:text-[30px] lg:text-[36px] font-bold mb-4 sm:mb-6 text-[#131313] animate-slide-in-right">{t("services.market")}</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder={t("placeholder.market")}
          className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-[#4DC7E8]/50 focus:border-[#4DC7E8] focus:ring-2 focus:ring-[#4DC7E8]/30 text-sm md:text-base placeholder:text-[#4DC7E8]/70 bg-white shadow-sm hover:shadow-[#4DC7E8]/30 transition-all duration-300 animate-slide-in-left"
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
          className="w-full sm:w-1/3 px-4 py-2 rounded-lg border border-[#4DC7E8]/50 focus:border-[#4DC7E8] focus:ring-2 focus:ring-[#4DC7E8]/30 text-sm md:text-base bg-white shadow-sm hover:shadow-[#4DC7E8]/30 transition-all duration-300 animate-slide-in-right"
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
          ? Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
          : dataMarket.map((market, index) => (
            <MarketCard key={market.id} market={market} lang={lang} index={index} />
          ))}
      </div>
      {!isLoading && dataMarket.length === 0 && (
        <p className="text-center text-gray-600 text-[16px] md:text-[18px] font-medium mt-10 animate-fade-in">{t("common.noData")}</p>
      )}
    </div>
    {totalPages > 1 && (
      <div className="flex justify-center mt-8 flex-wrap gap-2 px-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg font-medium text-sm md:text-base transition-all duration-300 shadow-sm animate-fade-in ${currentPage === page
                ? "bg-[#4DC7E8] text-white shadow-[#4DC7E8]/50"
                : "bg-white text-[#4DC7E8] border border-[#4DC7E8]/50 hover:bg-[#4DC7E8]/10 hover:shadow-[#4DC7E8]/30"
              }`}
            style={{ animationDelay: `${page * 0.1}s` }}
          >
            {page}
          </button>
        ))}
      </div>
    )}
  </div>
);
};

// CSS animations
const styles = `
  .animate-slide-up {
    animation: slideUp 0.5s ease-out forwards;
    opacity: 0;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.5s ease-out forwards;
    opacity: 0;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.5s ease-out forwards;
    opacity: 0;
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
    opacity: 0;
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideInLeft {
    from {
      transform: translateX(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// Append CSS to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Market;