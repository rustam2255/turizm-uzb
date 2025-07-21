// Travel Component
import { useNavigate } from "react-router-dom";
import IMAGE from "@assets/images/samarkand-img.png";
import { t } from "i18next";
import { slugify } from "@/utils/slugify";

interface TravelCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
}

const Travel: React.FC<TravelCardProps> = ({ id, title, description, image }) => {
  const navigate = useNavigate();

  const handleHotelDetail = (id: number, title:string) => {
    navigate(`/media/news/detail/${id}-${slugify(title)}`);
  };

  return (
    <div 
      onClick={() => handleHotelDetail(id, title)} 
      className="group cursor-pointer md:border-b pb-6 md:border-gray-200 hover:border-gray-300 transition-all duration-300 hover:bg-gray-50/30 rounded-xl hover:shadow-lg px-2 -mx-2"
    >
      <div className="overflow-hidden rounded-xl mb-6 md:mb-4 shadow-md group-hover:shadow-xl transition-shadow duration-300">
        <img
          src={image || IMAGE}
          alt={title}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = IMAGE;
          }}
          className="w-full h-75 md:h-[454px] object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="space-y-3">
        <p className="text-[14px] md:text-[16px] leading-[120%] text-[#DE5D26] font-semibold tracking-wide uppercase">
          {t('media.news')}
        </p>
        <div className="flex flex-col items-start gap-y-2.5">
          <h2 className="text-gray-900 text-[20px] md:text-[32px] leading-[110%] font-bold group-hover:text-[#DE5D26] transition-colors duration-200">
            {title}
          </h2>
          <p className="text-gray-700 text-[14px] md:text-[16px] leading-[140%] font-medium line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Travel;