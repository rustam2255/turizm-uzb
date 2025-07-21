import React, { useState } from "react";
import { Link } from "react-router-dom";
import IMAGE1 from "@assets/images/place1.png";
import IMAGE2 from "@assets/images/place3.png";
import ArticleSkleton from "@/components/ui/loaderSkleton/articleSkleton";
import { useTranslation } from "react-i18next";
import { useGetArticlesQuery } from "@/services/api";

const ArticleCard: React.FC<{
  title: string;
  image: string;
  last_date: string;
  author: string;
  author_photo?: string;
  created_at?: string;
}> = ({ title, image, last_date, author, author_photo, created_at }) => {
  const fallbackImages = [IMAGE1, IMAGE2];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    target.src = fallbackImages[randomIndex];
  };

  return (
    <div className="flex h-full flex-col">
      <div className="overflow-hidden w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3]">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={handleImageError}
        />
      </div>
      <div className="flex flex-col justify-between flex-1 mt-3 sm:mt-4">
        <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl mt-2 sm:mt-3 lg:mt-4 mb-1 text-[#131313] line-clamp-2 leading-tight">
          {title}
        </h3>

        <div className="flex flex-row items-center gap-2 mt-2 sm:mt-3">
          <img
            src={author_photo || IMAGE1}
            alt={author}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover flex-shrink-0"
            onError={handleImageError}
          />
          <p className="text-sm sm:text-base text-[#131313] font-medium truncate">{author}</p>
        </div>

        <div className="flex flex-row items-center gap-x-1 sm:gap-x-2 text-black/30 mt-1 sm:mt-2">
          <p className="text-xs sm:text-sm lg:text-base font-medium">{created_at}</p>
          <span className="bg-black/30 rounded-full w-0.5 h-0.5 flex-shrink-0"></span>
          <p className="text-xs sm:text-sm lg:text-base font-medium">{last_date}</p>
        </div>
      </div>
    </div>
  );
};

const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center text-sm sm:text-base lg:text-lg font-medium gap-1 sm:gap-2">
      <Link to="/" className="hover:underline text-black">{t("breadcrumb.home")}</Link>
      <span className="text-black">&gt;</span>
      <span className="text-[#DE5D26]">{t("breadcrumb.article")}</span>
    </div>
  );
};

const ArticleUI: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as "uz" | "ru" | "en";

  const {
    data: articlesData,
    isLoading,
    isError,
  } = useGetArticlesQuery({page: currentPage});

  const articles = articlesData?.results ?? [];
  const totalPages = articlesData
    ? Math.ceil(articlesData.count / 100) 
    : 1;

  const getLocalizedText = (
    field?: { uz?: string; en?: string; ru?: string }
  ): string => {
    if (!field) return "";
    return field[currentLang] || field.en || "";
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-5 sm:py-6 md:py-8">
      <Breadcrumb />
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight mt-3 sm:mt-4 md:mt-5 font-serif mb-4 sm:mb-5 md:mb-6">
        {t("article.title")}
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 items-stretch">
          {Array.from({ length: 8 }).map((_, index) => (
            <ArticleSkleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <p className="text-center text-red-500 text-base sm:text-lg">{t("articles.fetch_error")}</p>
      ) : (
        <div className="grid font-serif grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 items-stretch">
          {articles.map((article, idx) => (
            <Link
              key={`${article.id}-${idx}`}
              to={`/article/${article.id}`}
              className="block"
            >
              <ArticleCard
                title={getLocalizedText(article.title)}
                image={article.article_image || ""}
                author={article.author}
                author_photo={article.author_photo || ''}
                created_at={article.created_at}
                last_date={t("article.readTime")}
              />
            </Link>
          ))}
        </div>
      )}

      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex justify-center mt-6 sm:mt-8 gap-1 sm:gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded border text-xs sm:text-sm transition-colors ${
                pageNum === currentPage
                  ? "bg-[#DE5D26] text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleUI;