import React from "react";
import { useNavigate } from "react-router-dom";
import { slugify } from "@/utils/slugify";
import { useTranslation } from "react-i18next";


interface HotelCardProps {
  id: number;
  name: string;
  images: { id: number; image: string }[];
  description: string;
}

const HotelCard: React.FC<HotelCardProps> = ({ id, name, images, description }) => {
  const navigate = useNavigate();
  const { t} = useTranslation();
  
  const handleHomeDetail = (id: number, name: string) => {
    navigate(`/hotels/${id}-${slugify(name)}`);
  };

  return (
    <div
      onClick={() => handleHomeDetail(id, name)}
      className="cursor-pointer flex flex-col bg-white dark:bg-transparent dark:border-blue-950 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-sky-100 hover:border-sky-300 group"
    >
      <div className="relative overflow-hidden">
        {images[0]?.image ? (
          <img
            src={images[0].image}
            alt={`${name} room`}
            loading="lazy"
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-sky-400"
              fill="none"
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-sky-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-sky-900 dark:text-white mb-3 line-clamp-2 group-hover:text-sky-700 transition-colors duration-300">
          {name}
        </h3>
        <p className="text-gray-700 hover:text-sky-700 dark:text-white text-sm leading-relaxed line-clamp-3 mb-4">
          {description.substring(0, 100)}...
        </p>
        <div className="flex items-center text-[rgba(25,110,150,255)] font-medium text-sm group-hover:text-blue-700 transition-colors duration-300">
          <span>{t("common.details")}</span>
          <svg
            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;