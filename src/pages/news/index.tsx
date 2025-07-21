// News.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetNewsQuery } from "@/services/api";
import NewsUI from "./newsUI";

const Breadcrumb: React.FC = () => (
  <div className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2">
    <Link to="/" className="hover:underline text-black">Home</Link>
    <span className="text-black">&gt;</span>
    <span className="text-[#DE5D26]">News</span>
  </div>
);

export interface NewsProps {
  id: number;
  title: { en: string; uz?: string; ru?: string };
  description: { en?: string; uz?: string; ru?: string };
  image: string | null;
  category: {
    id: number;
    name: { en: string; uz?: string; ru?: string };
  }
}

const slugify = (text: string) =>
  text.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

const News: React.FC = () => {
  const navigate = useNavigate();
  const { data: newsData = [], isLoading, isError } = useGetNewsQuery();

  const handleCardClick = (id: number, title: string) => {
    const slug = slugify(title);
    navigate(`/news/${id}-${slug}`);
  };

  if (isError) return <div className="text-center text-red-500">Ma'lumotlarni olishda xatolik yuz berdi</div>;

  return (
    <div className="pt-[72px] md:pt-[72px] lg:pt-[78px] font-serif">
      <div className="w-full px-4 pt-[30px] md:min-h-screen lg:px-[80px]">
        <Breadcrumb />
        <h1 className="text-[20px] md:text-[32px] leading-[100%] mt-2 md:mt-5 font-serif mb-3 md:mb-[14px]">
          News
        </h1>
        <NewsUI
          loading={isLoading}
          newsData={newsData}
          onCardClick={handleCardClick}
        />
      </div>
    </div>
  );
};

export default News;
