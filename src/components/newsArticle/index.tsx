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
  } = useGetArticlesQuery({ page: 1 });

  const loading = NewsLoading || articlesLoading;
  const error = NewsError || articlesError;

  const articles = articlesData?.results ?? [];

  return (
    <>
      {articles.length > 0 && (
        <div className="w-full px-4  md:pt-[40px] md:min-h-screen lg:px-[80px] mb-2" id="media">
          <p className="md:text-3xl text-sm text-[rgba(25,110,150,255)] text-center leading-[100%] md:leading-[50px]  md:text-center md:mb-8 hover:scale-105 transition-all duration-500 ease-out font-bold">
            {t("newsArticle.title")}
          </p>

          {loading ? (
            <div className="animate-pulse">
              <NewsSkeleton />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{t("newsArticle.error")}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_3fr_1.5fr] gap-x-4">
              <div className="md:col-span-1 md:border-gray-300 md:border-r md:pr-4 space-y-19">
                {newsdata?.slice(0, 2).map((item, index) => (
                  <div
                    key={item.id}
                    className="opacity-100 hover:scale-105 transition-all duration-300 ease-out hover:shadow-lg animate-slide-in-left"
                    style={{
                      animationDelay: `${index * 150}ms`
                    }}
                  >
                    <HotelCard
                      id={item.id}
                      images={item.image || ''}
                      title={getLocalizedText(item.title)}
                      description={getLocalizedText(item.description)}
                    />
                  </div>
                ))}
              </div>

              <div className="md:col-span-1 md:border-gray-300 md:border-r md:pr-4 space-y-4">
                {newsdata?.slice(2, 3).map((item) => (
                  <div
                    key={item.id}
                    className="opacity-100 hover:scale-105 transition-all duration-300 ease-out hover:shadow-xl animate-slide-in-up"
                    style={{
                      animationDelay: '300ms'
                    }}
                  >
                    <Travel
                      id={item.id}
                      title={getLocalizedText(item.title)}
                      description={getLocalizedText(item.description)}
                      image={item.image || ''}
                    />
                  </div>
                ))}
                <div>
                  {newsdata?.slice(3, 4).map((item) => (
                    <div
                      key={item.id}
                      className="opacity-100 hover:scale-105 transition-all duration-300 ease-out hover:shadow-lg animate-slide-in-up"
                      style={{
                        animationDelay: '450ms'
                      }}
                    >
                      <HotelCard
                        id={item.id}
                        images={item.image || ''}
                        title={getLocalizedText(item.title)}
                        description={getLocalizedText(item.description)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-1 max-md:mr-20">
                <div className="md:pt-0 opacity-100 animate-slide-in-right" style={{ animationDelay: '600ms' }}>
                  <h3 className="text-[24px] leading-[100%] text-[rgba(25,110,150,255)] font-normal mb-1.5 md:mb-3 hover:text-sky-200 transition-colors duration-300">
                    {t("newsArticle.article")}
                  </h3>
                  <div className="space-y-1">
                    {articles.slice(0, 8).map((article, index) => (
                      <div
                        key={article.id}
                        className="opacity-100 hover:scale-102 transition-all duration-300 ease-out hover:shadow-md border-l-2 border-transparent hover:border-blue-600 pl-2 animate-fade-in-stagger"
                        style={{
                          animationDelay: `${700 + index * 100}ms`
                        }}
                      >
                        <ArticleCard
                          id={article.id}
                          title={getLocalizedText(article.title)}
                          author={(article.author)}
                          created_at={article.created_at}
                          article_image={article.article_image || ''}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-stagger {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-down {
          animation: slide-down 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in-stagger {
          animation: fade-in-stagger 0.5s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
        </div>
      )}
    </>

  );
};

export default NewsArticle;