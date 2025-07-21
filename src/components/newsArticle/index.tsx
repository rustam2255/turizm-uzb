import React from "react";
import { useTranslation } from "react-i18next";

import HotelCard from "../ui/HotelCard";
import Travel from "../ui/TravelCard";
import ArticleCard from "../ui/ArticleCard";
import NewsSkeleton from "../ui/loaderSkleton/newsSkleton";

import {
  useGetArticlesQuery,
  useGetNewsQuery
} from "@/services/api";

const NewsArticle: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as "uz" | "ru" | "en";

  const getLocalizedText = (
    field?: { uz?: string; en?: string; ru?: string }
  ): string => {
    if (!field) return "";
    return field[currentLang] || field.en || "";
  };

 const {
  data: newsdata = [],
  isLoading: NewsLoading,
  isError: NewsError,
 } = useGetNewsQuery({});



  const {
    data: articlesData,
    isLoading: articlesLoading,
    isError: articlesError,
  } = useGetArticlesQuery({page: 1});

  const loading = NewsLoading || articlesLoading;
  const error = NewsError || articlesError;

  
  
  
  const articles = articlesData?.results ?? [];

  return (
    <div className="w-full px-4 font-serif pt-[65px] md:pt-[60px] md:min-h-screen lg:px-[80px] mb-8" id="media">
      <h1 className="text-[24px] text-[#161616] leading-[100%] mb-1.5 md:leading-[50px] md:text-[40px] font-serif text-start md:text-center md:mb-8">
        {t("newsArticle.title")}
      </h1>

      {loading ? (
        <NewsSkeleton />
      ) : error ? (
        <div className="text-red-500 text-center">{t("newsArticle.error")}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_3fr_1.5fr] gap-x-4">
          <div className="md:col-span-1 md:border-gray-300 md:border-r md:pr-4">
            {newsdata?.slice(0, 2).map((item) => (


              <HotelCard
                key={item.id}
                id={item.id}
                images={item.image || ''}
                title={getLocalizedText(item.title)}
                description={getLocalizedText(item.description)}
              />

            ))}
          </div>

          <div className="md:col-span-1 md:border-gray-300 md:border-r md:pr-4">
            {newsdata?.slice(2, 3).map((item) => (
              <Travel
                key={item.id}
                id={item.id}
                title={getLocalizedText(item.title)}
                description={getLocalizedText(item.description)}
                image={item.image || ''}
              />
            ))}
            <div>
              {newsdata?.slice(3, 4).map((item) => (
                <HotelCard
                  key={item.id}
                  id={item.id}
                  images={item.image || ''}
                  title={getLocalizedText(item.title)}
                  description={getLocalizedText(item.description)}
                />

              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="pt-4 md:pt-0">
              <h3 className="text-[16px] leading-[100%] text-[#DE5D26] mb-1.5 md:mb-3">
                {t("newsArticle.article")}
              </h3>
              {articles.slice(0, 5).map((article) => (
                <ArticleCard
                  id={article.id}
                  key={article.id}
                  title={getLocalizedText(article.title)}
                  author={(article.author)}
                  created_at={article.created_at}
                  article_image={article.article_image || ''}
                />
              ))}
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default NewsArticle;
