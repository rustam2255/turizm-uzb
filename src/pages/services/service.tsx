import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import HotelImage from "@/assets/images/hotels.png";
import ResortImage from "@/assets/images/place1.png";
import TourFirmImage from "@/assets/images/tour-firm.png";
import BankImage from "@/assets/images/banks.png";
import ClinicImage from "@/assets/images/clinic.png";
import MarketImage from "@/assets/images/market.png";

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
    <Link to={link} className="block w-full max-w-[490px]">
      <motion.div
        onClick={onClick}
        className={`w-full max-w-[490px] h-[250px] sm:h-[280px] md:h-[320px] lg:h-[330px] relative rounded-2xl overflow-hidden cursor-pointer ${
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
          <motion.img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(77,199,232,0.7)] via-[rgba(77,199,232,0.2)] to-transparent" />
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 p-3 sm:p-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 + id * 0.1 }}
        >
          <h3 className="text-white font-semibold text-base sm:text-lg leading-tight">
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
      className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="hover:underline text-black">
        {t("breadcrumb.home")}
      </Link>
      <span className="text-black">&gt;</span>
      <span className="" style={{ color: 'rgba(77,199,232,1)' }}>
        {t("services.title")}
      </span>
    </motion.div>
  );
};

const ServiceUI: React.FC = () => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = React.useState<number | null>(null);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  console.log(isInitialLoad);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const services = [
    { id: 1, key: "services.hotels", imageUrl: HotelImage, link: '/hotels' },
    { id: 2, key: "services.resort", imageUrl: ResortImage, link: '/services/resort' },
    { id: 3, key: "services.tour-firm", imageUrl: TourFirmImage, link: '/services/tours' },
    { id: 4, key: "services.banks", imageUrl: BankImage, link: '/services/banks' },
    { id: 5, key: "services.clinic", imageUrl: ClinicImage, link: '/services/clinics' },
    { id: 6, key: "services.market", imageUrl: MarketImage, link: '/services/market' },
  ];

  return (
    <div className="w-full py-6">
      <div className="max-w-[1800px] mx-auto px-4 md:px-[80px]">
        <Breadcrumb />
        <motion.h1
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-sky-800 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("services.title")}
        </motion.h1>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 justify-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={t(service.key)}
                imageUrl={service.imageUrl}
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
  );
};

export default ServiceUI;