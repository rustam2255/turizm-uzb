import React from "react";
import IMAGE1 from "@assets/images/magazine1.jpg"
import IMAGE2 from "@assets/images/magazine2.jpg"
import { Link } from "react-router-dom";
import { slugify } from "@/utils/slugify";

interface MagazineUIProps {
  id: number;
  title: string;
  coverImage: string;
  dateRange: string;
  year: string;
}

const MagazineUI: React.FC<MagazineUIProps> = ({ id, title, coverImage, dateRange, year }) => {

  const fallbackImages = [IMAGE1, IMAGE2];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    target.src = fallbackImages[randomIndex];
  };

  return (
    <div className="flex w-1/2 md:px-0 flex-col bg-[rgba(235, 240, 245, 1)] items-start sm:items-center md:items-center">
      <div className="flex flex-col items-center">
        <Link to={`/magazines/${id}-${slugify(title)}`}>
          <img
            src={coverImage}
            alt={`${title} magazine cover`}
            className="w-full h-[200px]  md:w-[200px] md:h-[250px] sm:w-[160px] sm:h-[150px]  mb-4 transition-transform duration-200 hover:scale-105"
            onError={handleImageError}
            loading="lazy"
          />
        </Link>
        <div className="text-center text-black font-normal leading-[100%]">
          <p className="mb-1 text-[14px] md:text-[15px] sm:text-[13px]">{dateRange}</p>
          <p className="mb-1 text-[14px] md:text-[15px] sm:text-[13px]">
            {title?.length > 15 ? title.slice(0, 15) + '...' : title}
          </p>
          <p className="text-[14px] md:text-[15px] sm:text-[13px]">{year}</p>
        </div>
      </div>
    </div>
  );
};

export default MagazineUI;