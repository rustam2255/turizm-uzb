import React from "react";
import IMAGE from "@assets/images/hotel12.jpg";
import { useNavigate } from "react-router-dom";
import { slugify } from "@/utils/slugify";

interface HotelCardProps {
  id: number;
  name: string;
  images: {
    id:number;
    image: string;
  }[];
  description: string;
}

const HotelCard: React.FC<HotelCardProps> = ({ id, name, images, description }) => {
  const navigate = useNavigate();

  const handleHomeDetail = (id: number, name:string) => {
    navigate(`hotels/${id}-${slugify(name)}`);
  };

  return (
    <div
      onClick={() => handleHomeDetail(id, name)}
      className="cursor-pointer flex flex-col  leading-[100%] text-[#131313]"
    >
      <div className="overflow-hidden mb-3">
        <img
          src={images[0].image}
          alt={`${name} room`}
          className="w-full h-[210px] rounded-xl mb-4 object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = IMAGE;
          }}
        />
      </div>
      <h2 className="text-[24px] mb-4">{name}</h2>
      <p className="font-medium text-[16px]">{description}</p>
    </div>
  );
};

export default HotelCard;
