// ServiceUI.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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
  link: string
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  imageUrl,
  isActive,
  link,
  onClick,
}) => {
  return (
    <Link to={link} className="block w-full max-w-[490px]">
      <div
        onClick={onClick}
        className={`w-full max-w-[490px] h-[250px] sm:h-[280px] md:h-[320px] lg:h-[330px] relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${isActive ? "ring-2 ring-blue-500 ring-offset-2" : ""
          }`}
      >
        <div className="relative h-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <h3 className="text-white font-semibold text-base sm:text-lg leading-tight">
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
    <div className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2">
      <Link to="/" className="hover:underline text-black">
        {t("breadcrumb.home")}
      </Link>
      <span className="text-black">&gt;</span>
      <span className="text-blue-500">{t("services.title")}</span>
    </div>
  );
};

const ServiceUI: React.FC = () => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = React.useState<number | null>(1);

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
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif mb-6">
          {t("services.title")}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 justify-items-center">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={t(service.key)}
              imageUrl={service.imageUrl}
              isActive={activeId === service.id}
              onClick={() => setActiveId(service.id)}
              link={service.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceUI;