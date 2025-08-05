import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGetDashboardListQuery } from "@/services/api";

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
  id,
}) => {
  return (
    <Link to={link} className="block w-full max-w-[550px]">
      <motion.div
        onClick={onClick}
        className={`w-full 
          h-[280px] 
          sm:h-[300px] 
          md:h-[320px] 
          lg:h-[280px] 
          xl:h-[300px] 
          2xl:h-[320px]
          min-h-[250px]
          relative rounded-2xl overflow-hidden cursor-pointer ${
          isActive ? "ring-2 ring-[rgba(77,199,232,1)] ring-offset-2" : ""
        }`}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.5, delay: id * 0.1 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 10px 20px rgba(77, 199, 232, 0.5)",
        }}
        style={{ boxShadow: "0 5px 15px rgba(77, 199, 232, 0.3)" }}
      >
        <div className="relative h-full overflow-hidden">
          <picture>
            {/* WebP formatini qo'llab-quvvatlash (agar API'da mavjud bo'lsa) */}
            <source srcSet={`${imageUrl}?format=webp`} type="image/webp" />
            <motion.img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy" // Lazy loading qo'shildi
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                e.currentTarget.src = "/fallback-image.webp"; // Optimallashtirilgan zaxira rasm
              }}
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(77,199,232,0.7)] via-[rgba(77,199,232,0.2)] to-transparent" />
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 + id * 0.1 }}
        >
          <h3 className="text-white font-semibold text-base sm:text-lg md:text-xl leading-tight">
            {title}
          </h3>
        </motion.div>
      </motion.div>
    </Link>
  );
};

const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      className="flex items-center text-sm font-sans font-medium md:text-base lg:text-lg gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="hover:underline text-black dark:text-white">
        {t("breadcrumb.home")}
      </Link>
      <span className="text-black dark:text-white">&gt;</span>
      <span className="" style={{ color: "rgba(25,110,150,255)" }}>
        {t("services.title")}
      </span>
    </motion.div>
  );
};

// Statik services massivi (link va key bilan)
const staticServices: Service[] = [
  { id: 1, key: "services.hotels", link: "/hotels", titleEn: "Hotels" },
  { id: 2, key: "services.resort", link: "/services/resort", titleEn: "Resort" },
  { id: 3, key: "services.tour-firm", link: "/services/tours", titleEn: "Tour Firm" },
  { id: 4, key: "services.banks", link: "/services/banks", titleEn: "Bank" },
  { id: 5, key: "services.clinic", link: "/services/clinics", titleEn: "Clinic" },
  { id: 6, key: "services.market", link: "/services/market", titleEn: "Market" },
];

const ServiceUI: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeId, setActiveId] = useState<number | null>(null);
  const { data: apiServices, isLoading, isError } = useGetDashboardListQuery();

  // Joriy tilni aniqlash
  const currentLanguage = i18n.language as keyof MultilangText;

  // API va statik ma'lumotlarni birlashtirish
  const formattedServices = apiServices?.map((apiService) => {
    const staticService = staticServices.find(
      (s) => s.id === apiService.id || s.titleEn.toLowerCase() === (apiService.title.en ?? '').toLowerCase()
    );
    return {
      id: apiService.id,
      title: apiService.title,
      file: `${apiService.file}?w=800`, // Rasm o'lchamini cheklash
      key: staticService?.key || "services.default",
      link: staticService?.link || "/services/default",
    };
  }) || [];

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
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-[80px]">
          <Breadcrumb />
          <motion.div
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServiceUI;