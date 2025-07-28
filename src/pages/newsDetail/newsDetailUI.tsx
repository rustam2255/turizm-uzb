import React from "react";
import { Link, useParams } from "react-router-dom";
import IMAGE from "@assets/images/samarkand-img.png";
import { useTranslation } from "react-i18next";
import { useGetNewsDetailQuery } from "@/services/api";

import { getLocalized } from "@/utils/getLocalized";

const NewsDetailUI: React.FC = () => {
  const { idAndSlug } = useParams<{ idAndSlug: string }>();
  const id = Number(idAndSlug?.split("-")[0]);
  const { t, i18n } = useTranslation();
  const lang = i18n.language

  const { data: newsItem, error, isLoading } = useGetNewsDetailQuery(id, {
    skip: !id,
  });

  console.log(newsItem);

  if (isLoading) return <div className="text-center py-10">Yuklanmoqda...</div>;
  if (error) return <div className="text-center text-red-500">Ma'lumotlarni yuklashda xatolik yuz berdi</div>;
  if (!newsItem) return <div className="text-center">Ma'lumot topilmadi</div>;

  return (
    <div className=" py-8 w-full max-w-[1500px] px-4 sm:px-6 md:px-8 lg:px-4 mx-auto">
      <div className="flex items-center text-[14px] font-medium md:text-[18px] gap-2">
        <Link to="/" className="hover:underline text-black">{t("breadcrumb.home")}</Link>
        <span className="text-black">&gt;</span>
        <span className="text-[#DE5D26]">{t("navbar.news")}</span>
      </div>

      <div className=" w-full mt-4 md:mt-5">
        <h1 className="text-[20px] md:text-[24px] text-[#131313] leading-[100%] mb-1">
          {getLocalized(newsItem.title, lang)}
        </h1>

        <img
          src={newsItem.image || IMAGE}
          alt={getLocalized(newsItem.title)}
          className="w-full max-h-96 h-[300px] sm:h-[350px] md:h-[400px] object-cover mb-[13px] mt-7"
          onError={(e) => ((e.target as HTMLImageElement).src = IMAGE)}
        />

        <p className="font-medium text-[15px] md:text-[18px] text-[rgba(100, 100, 100, 1)] leading-[26px] mt-7 tracking-[1%]">
          {getLocalized(newsItem.description, lang)}
        </p>

        <div
          className="prose font-medium text-[15px] md:text-[18px] mt-7 leading-[26px] tracking-[1%] max-w-none"
          dangerouslySetInnerHTML={{ __html: getLocalized(newsItem.body, lang) }}
        />
      </div>
    </div>
  );
};

export default NewsDetailUI;