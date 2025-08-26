import React from "react";
import { useTranslation } from "react-i18next";
import IMAGE from "@assets/images/samarkand-img.png";
import { useNavigate } from "react-router-dom";
import { useGetNearTravelsQuery } from "@/services/api"; 

type TravelItem = {
  id: number;
  title: string;
  image: string | null;
  description: {
    en: string;
    uz: string;
    ru: string;
  };
};

interface Props {
  hotelId: string;
}

const NearTravels: React.FC<Props> = ({ hotelId }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'uz' | 'ru';
  const navigate = useNavigate();

  const { data: travels, isLoading, isError } = useGetNearTravelsQuery(hotelId, {
    skip: !hotelId,   
  });

  if (isLoading || !travels || travels.length === 0) return null;
  if (isError) return <div>{t("error.loading")}</div>;

  return (
    <div className="container py-6 md:py-[60px] w-full ">
      <p className="text-[24px] leading-[100%] text-start md:text-center md:text-[40px] text-[#161616] mb-[10px] md:mb-[20px]">
        {t("travel.nearby_travel_places")}
      </p>

      <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-7.5 overflow-x-auto flex md:overflow-visible space-x-4 md:space-x-0 snap-x snap-mandatory scrollbar-hide">
        {travels.slice(0, 4).map((travel: TravelItem) => (
          <div
            key={travel.id}
            className="min-w-[80%] md:min-w-0 snap-center cursor-pointer"
            onClick={() => navigate(`/hotels/${travel.id}`)}
          >
            <div className="flex flex-col leading-[130%] text-[#131313] h-full">
              <div className="overflow-hidden mb-3">
                <img
                  src={travel.image || IMAGE}
                  alt={`${travel.title} room`}
                  className="w-full h-[210px] mb-4 object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = IMAGE;
                  }}
                />
              </div>
              <div className="flex flex-col justify-between">
                <h2 className="text-[24px] mb-2 min-h-[64px] line-clamp-1">
                  {travel.title}
                </h2>
                <p className="font-medium text-[16px] min-h-[60px] line-clamp-3">
                  {travel.description?.[lang]?.length > 30
                    ? travel.description[lang].slice(0, 30) + "..."
                    : travel.description[lang]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearTravels;
