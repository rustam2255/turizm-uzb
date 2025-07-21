import React from "react";
import { useTranslation } from "react-i18next";
import HotelCard from "@components/hotelCard";
import { useGetHotelsQuery } from "@/services/api";

const HotelCardUI: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as "uz" | "ru" | "en";

  const {
    data: hotelsData,
    error,
    isLoading,
  } = useGetHotelsQuery({ page: 1 });

  const getLocalizedText = (field?: { uz?: string; en?: string; ru?: string }): string => {
    if (!field) return "";
    return field[currentLang] || field.en || "";
  };

  if (isLoading) {
    return <div className="p-6">loading...</div>;
  }
  if (error || !hotelsData) {
    return <div className="p-6 text-red-500">ERROR</div>;
  }

  const hotels = hotelsData.results.slice(0, 4);

  return (
    <div className="w-full py-6 md:py-[60px] " id="hotelCard">
      <h1 className="text-[24px] leading-[100%] text-start md:text-center md:text-[40px] text-[#161616] mb-[10px] md:mb-[20px]">
        {t("hotels.the_suite_hotels")}
      </h1>
      <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-7.5 overflow-x-auto flex md:overflow-visible space-x-4 md:space-x-0 snap-x snap-mandatory scrollbar-hide">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="min-w-[80%] md:min-w-0 snap-center">
            <HotelCard
              id={hotel.id}
              name={hotel.name}
              image={hotel.images[0]}
              description={getLocalizedText(hotel.description)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelCardUI;
