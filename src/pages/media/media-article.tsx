import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetArticlesQuery } from "@/services/api";
import { Search, ChevronDown, ChevronUp, Eye, Calendar, User } from "lucide-react";
import type { ArticleItem, Lang } from "@/interface/index";
import IMAGE from '@/assets/images/place3.png'
import { t } from "i18next";
import { Link } from "react-router-dom";
import { slugify } from "@/utils/slugify";
// Compact Skeleton Loader
const ArticleSkeleton = () => (
  <div className="border-b border-gray-100 pb-4 mb-4 last:border-b-0 animate-pulse">
    <div className="flex gap-3">
      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gray-200 rounded mb-2" />
        <div className="h-3 bg-gray-200 rounded mb-2 w-4/5" />
        <div className="flex items-center gap-2">
          <div className="h-2 bg-gray-200 rounded w-12" />
          <div className="h-2 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  </div>
);

const CompactArticleCard = ({ article }: { article: ArticleItem }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language as Lang;

  return (
    <Link to={`/media/article/detail/${article.id}-${slugify(article.title.uz || '')}`}>
      <div className="group cursor-pointer border-b border-gray-100 pb-4 mb-4 last:border-b-0 hover:bg-gray-50/50 rounded-lg transition-all duration-200 p-2 -m-2">
        <div className="flex gap-3">
          {/* Compact Image */}
          <div className="relative overflow-hidden rounded-lg flex-shrink-0">
            {article.article_image ? (
              <img
                src={article.article_image || IMAGE}
                alt="article"
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
              {article.title[lang]}
            </h3>

            {/* Meta information */}
            <div className="flex items-center text-xs text-gray-500 space-x-3">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span className="truncate max-w-20">{article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(article.created_at).toLocaleDateString('uz-UZ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>

  );
};

// Show More/Less Button
const ShowMoreButton = ({
  isExpanded,
  onClick,
}: {
  isExpanded: boolean;
  onClick: () => void;
  totalCount: number;
  showingCount: number;
}) => (
  <button
    onClick={onClick}
    className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-600 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 group border border-blue-200/50"
  >
    {isExpanded ? (
      <>
        <span>{t('media.show_less')}</span>
        <ChevronUp className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
      </>
    ) : (
      <>
        <span>{t('media.show_more')}</span>
        <ChevronDown className="w-4 h-4 group-hover:translate-y-[2px] transition-transform" />
      </>
    )}
  </button>
);

// Main Sidebar Component
const ArticlesPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isLoading, isError } = useGetArticlesQuery({
    search,
    page: 1,
    page_size: isExpanded ? 20 : 6
  });

  const initialShowCount = 6;
  const displayArticles = data?.results || [];
  const shouldShowMore = data && data.count > initialShowCount;

  return (
    <div className="space-y-4">
      {/* Compact Search */}
      <div className="relative">
        <input
          type="text"
          placeholder={t('placeholder.articles')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 px-4 py-3 pl-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50/50"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      {/* Articles List */}
      <div className="space-y-1">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <ArticleSkeleton key={i} />
          ))
        ) : isError ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-500 text-sm">{t("error_loading")}</p>
          </div>
        ) : displayArticles.length ? (
          <>
            {displayArticles.map((article) => (
              <CompactArticleCard key={article.id} article={article} />
            ))}

            {/* Show More Button */}
            {shouldShowMore && (
              <ShowMoreButton
                isExpanded={isExpanded}
                onClick={() => setIsExpanded(!isExpanded)}
                totalCount={data.count}
                showingCount={Math.min(displayArticles.length, initialShowCount)}
              />
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">{t("no_results")}</p>
            {search && (
              <p className="text-gray-400 text-xs mt-1">
                {t('media.no_results')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      {data && data.count > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{t(`media.total_articles`)}</span>
              <p>{data.count}</p>
            </div>
            {search && (
              <div className="text-blue-500">
                {displayArticles.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;