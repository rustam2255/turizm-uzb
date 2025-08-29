import { slugify } from "@/utils/slugify";
import IMAGE from "@assets/images/place1.png";
import { useNavigate } from "react-router-dom";

interface ArticleCardProps {
  id: number;
  article_image: string;
  title: string;
  author: string;
  created_at: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ id, article_image, title, author, created_at }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/article/${id}-${slugify(title)}`);
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="group flex justify-between cursor-pointer w-full border-b pb-6 pt-4 md:pt-0 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:bg-gray-50/50 rounded-lg hover:shadow-sm px-2 -mx-2"
    >
      <div className="flex flex-col items-start gap-y-2 md:gap-y-2.5 flex-1 pr-4">
        <h3 className="text-gray-900 dark:text-white text-[18px] leading-[26px] font-semibold tracking-[-0.01em] group-hover:text-sky-900 transition-colors duration-200 line-clamp-2">
          {title}
        </h3>
        <div className="flex flex-col gap-y-1">
          <p className="dark:text-white/50 text-[14px] leading-[140%] font-medium tracking-normal">
            {author}
          </p>
          <p className="text-gray-500 text-[13px] leading-[140%] dark:text-sky-900 font-normal tracking-normal">
            {created_at}
          </p>
        </div>
      </div>
      
      <div className="w-[100px] mt-2 h-[70px] flex-shrink-0  overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
        <img
          src={article_image || IMAGE}
          loading="lazy"
          alt={title || "ArticleCard"}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = IMAGE;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );
};

export default ArticleCard;