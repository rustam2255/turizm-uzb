import React from "react";
import { useNavigate } from "react-router-dom";

import IMAGE from "@assets/images/samarkand-img.png";
import { useGetToursQuery } from "@/services/api";
import { useTranslation } from "react-i18next";
import { slugify } from "@/utils/slugify";

const TravelCollection: React.FC = () => {


  const { t,i18n } = useTranslation();
  const lang = i18n.language.split("-")[0] as "uz" | "ru" | "en";
  interface City {
    name_en: string;
    name_ru: string;
    name_uz: string;
  }

  interface Tours {
    id: number;
    name: string;
    city: City;
    latitude: number;
    longitude: number;
    image: string[]; 
  }
  const getLocalizedCityName = (
    city: City | undefined,
    lang: "uz" | "ru" | "en"
  ): string => {
    if (!city) return "";
    return city[`name_${lang}`] || city.name_en || "";
  };


  const { data, error, isLoading } = useGetToursQuery({ page: 1 });

  const navigate = useNavigate();

  const handleDetail = (id: number, name:string) => {
    navigate(`/services/tour/${id}-${slugify(name)}`);
  };

  if (isLoading) return <div className="text-center py-8">{t("travel.loading")}</div>;
  if (error) return <div className="text-center py-8 text-red-500">{t("travels.fetch_error")}</div>;

  return (
    <div className="w-full py-[30px] md:py-[60px] w-ful" id="detanation">
      <h1 className="text-[24px] md:text-[40px] leading-[100%] text-[#161616] text-center mb-3 md:mb-5">
        {t("travel.travel_collections")}
      </h1>

      <div className="grid overflow-hidden grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-7.5">
        {data?.results?.slice(0, 3).map((destination: Tours) => (
          <div
            onClick={() => handleDetail(destination.id, destination.name)}
            key={destination.id}
            className="cursor-pointer flex flex-col text-[#131313]"
          >
            <div className="w-full overflow-hidden">
              <img
                src={destination.image[0] || IMAGE}
                alt={destination.name || ""}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = IMAGE;
                }}
                className="w-full h-[240px] md:h-[260px] object-cover hover:scale-105 transition-transform duration-300 mb-3 md:mb-4"
              />
            </div>
            <div className="w-full">
              <h2 className="text-[20px] md:text-[28px] tracking-[2%] leading-[100%] mb-2 md:mb-3">
                {destination.name || ""}
              </h2>
              <p className="text-[14px] md:text-[16px] leading-[130%] font-medium">
                <p>{getLocalizedCityName(destination.city, lang)}</p> 
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelCollection;
