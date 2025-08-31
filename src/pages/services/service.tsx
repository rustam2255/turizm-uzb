import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {  AnimatePresence } from "framer-motion";
import { useGetDashboardListQuery } from "@/services/api";
import { Helmet } from "react-helmet-async";
// Interfeyslar
interface MultilangText {
  uz: string;
  en: string;
  ru: string;
}

interface Service {
  id: number;
  key: string;
  link: string;
  titleEn: string;
  is_active?: boolean;
}

interface ServiceCardProps {
  title: string;
  imageUrl: string;
  isActive?: boolean;
  onClick?: () => void;
  link: string;
  id: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  imageUrl,
  isActive,
  link,
  onClick,
  
}) => {
  return (
    <Link to={link} className="block w-full max-w-[550px]">
      <div
        onClick={onClick}
        className={`w-full 
          h-[280px] 
          sm:h-[300px] 
          md:h-[320px] 
          lg:h-[280px] 
          xl:h-[300px] 
          2xl:h-[320px]
          min-h-[250px]
          relative  overflow-hidden hover:scale-110 transition cursor-pointer ${isActive ? "ring-2 ring-[rgba(77,199,232,1)] ring-offset-2" : ""
          }`}
        
      >
        <div className="relative h-full overflow-hidden">
          <picture>
            {/* WebP formatini qo'llab-quvvatlash (agar API'da mavjud bo'lsa) */}
            <source srcSet={`${imageUrl}?format=webp`} type="image/webp" />
            <img
              src={imageUrl}
              alt={title}
              
              className="w-full h-full object-cover"
              loading="lazy" // Lazy loading qo'shildi
    
              onError={(e) => {
                e.currentTarget.src = "/fallback-image.webp"; // Optimallashtirilgan zaxira rasm
              }}
            />
          </picture>

        </div>

        <div
          className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5"
        >
          <h3 className="text-white font-semibold text-base sm:text-lg md:text-xl leading-tight">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div
      className="flex items-center text-sm font-sans font-medium md:text-base lg:text-lg gap-2"
    >
      <Link to="/" className="hover:underline text-black dark:text-white">
        {t("breadcrumb.home")}
      </Link>
      <span className="text-black dark:text-white">&gt;</span>
      <span className="" style={{ color: "rgba(25,110,150,255)" }}>
        {t("services.title")}
      </span>
    </div>
  );
};

// Statik services massivi (link va key bilan)
const staticServices: Service[] = [
  { id: 1, key: "services.hotels", link: "/hotels", titleEn: "Hotels", },
  { id: 2, key: "services.resort", link: "/services/resort", titleEn: "Resort" },
  { id: 3, key: "services.tour-firm", link: "/services/tours", titleEn: "Tour Companies" },
  { id: 4, key: "services.banks", link: "/services/banks", titleEn: "Banks" },
  { id: 5, key: "services.clinic", link: "/services/clinics", titleEn: "Medical Clinics" },
  { id: 6, key: "services.market", link: "/services/market", titleEn: "Market" },
  { id: 7, key: 'services.airplane', link: "/services/airplanes", titleEn: "Helicopters " },
  { id: 8, key: 'services.tourbus', link: '/services/tour-bus', titleEn: 'Transport Services' }
];

const ServiceUI: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeId, setActiveId] = useState<number | null>(null);
  const { data: apiServices, isLoading, isError } = useGetDashboardListQuery();

  // Joriy tilni aniqlash
  const currentLanguage = i18n.language as keyof MultilangText;

  // API va statik ma'lumotlarni birlashtirish
  const formattedServices =
    apiServices
      ?.map((apiService) => {
        const staticService = staticServices.find(
          (s) =>
            s.id === apiService.id ||
            s.titleEn.toLowerCase() === (apiService.title.en ?? "").toLowerCase()
        );
        return {
          id: apiService.id,
          title: apiService.title,
          file: apiService.file ? `${apiService.file}?w=800` : "",
          key: staticService?.key || "services.default",
          link: staticService?.link || "/services/default",
        };
      })
      // 🔹 faqat ichi to‘liq bo‘lganlarni chiqarish
      .filter(
        (service) =>
          service.title &&
          Object.values(service.title).some((t) => t?.trim() !== "") && // title bo‘sh emas
          service.file // rasm mavjud
      ) || [];


  if (isLoading) {
    return (
      <div className="w-full py-6 text-center">
        <p>{t("loading")}</p>
      </div>
    );
  }

  if (isError || !apiServices || formattedServices.length === 0) {
    return (
      <div className="w-full py-6 text-center text-red-500">
        <p>{t("error")}</p>
      </div>
    );
  }

  return (
    <div className="">
      {/* Oldindan yuklash uchun preload link (birinchi rasm uchun) */}
      {formattedServices[0] && (
        <link
          rel="preload"
          href={`${formattedServices[0].file}?w=800`}
          as="image"
          type="image/webp"
        />
      )}
      <div className="w-full min-h-screen py-4 sm:py-6 md:py-8">
        <Helmet>
          <title>{t("seo.servicesTitle", "O‘zbekiston xizmatlari | Tourism Uzbekistan | Turizm xizmatlari")}</title>
          <meta
            name="description"
            content={t("seo.servicesDescription", "O‘zbekiston bo‘yicha mehmonxonalar, kurortlar, banklar, klinikalar va boshqa xizmatlar ro‘yxati")}
          />
          <meta
            name="keywords"
            content="O‘zbekiston turizmi, mehmonxonalar, kurortlar, banklar, klinikalar, bozorlari, transport, sayohat, tours, hotels, PDF download, airlines, tour bus O‘zbekiston turizmi, O'zbekiston hotels, O‘zbek kurortlari, mehmonxonalar Uzbekistan, O‘zbekcha sayohat, Uzbekistan travel, PDF download, tours Uzbekistan, airlines Uzbekistan, tour bus, banklar O‘zbekistan, klinikalar Uzbekistan, bozorlari O‘zbekistan, hotels in Tashkent, resorts in Samarkand, Uzbekistan tourism, O‘zbekcha magazine, PDF magazine Uzbekistan, Uzbekistan news, O‘zbekiston transport, Uzbekistan flights, Uzbekistan tour packages, O‘zbekcha shops, O‘zbekiston hotels booking, Uzbekistan adventure, Uzbekistan cultural tours, Uzbekistan city guides, O‘zbekiston sightseeing, Uzbekistan family tours, Uzbekistan vacation, Uzbekistan tours & travel
"
          />
          <link rel="canonical" href="https://tourism-uzbekistan.uz/services" />
          {/* Open Graph */}
          <meta property="og:title" content="O‘zbekiston xizmatlari" />
          <meta property="og:description" content="O‘zbekiston bo‘yicha mehmonxonalar, kurortlar, banklar, klinikalar va boshqa xizmatlar ro‘yxati" />
          <meta property="og:url" content="https://tourism-uzbekistan.uz/services" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={formattedServices[0]?.file || "/fallback-image.webp"} />
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="O‘zbekiston xizmatlari" />
          <meta name="twitter:description" content="O‘zbekiston bo‘yicha mehmonxonalar, kurortlar, banklar, klinikalar va boshqa xizmatlar ro‘yxati" />
          <meta name="twitter:image" content={formattedServices[0]?.file || "/fallback-image.webp"} />
          {/* JSON-LD structured data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "O‘zbekiston xizmatlari",
              "url": "https://tourism-uzbekistan.uz/services",
              "itemListElement": formattedServices.map((service, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": service.title[currentLanguage] || service.title.en,
                "url": `https://tourism-uzbekistan.uz${service.link}`
              }))
            })}
          </script>
        </Helmet>
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-[80px]">
          <Breadcrumb />
          <div
            className="grid 
              grid-cols-1 
              sm:grid-cols-1 
              md:grid-cols-2 
              lg:grid-cols-3 
              xl:grid-cols-3
              2xl:grid-cols-3
              mt-5 
              gap-4 
              sm:gap-5 
              md:gap-6 
              lg:gap-8 
              xl:gap-10
              2xl:gap-12 
              justify-items-center
              auto-rows-max"
           
          >
            <AnimatePresence>
              {formattedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.title[currentLanguage] ?? ""}
                  imageUrl={service.file}
                  isActive={activeId === service.id}
                  onClick={() => setActiveId(service.id)}
                  link={service.link}
                  id={service.id}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceUI;