import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetNewsQuery, useGetNewsCategoriesQuery } from "@/services/api";
import { Search, Filter, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import IMAGE from '@assets/images/place3.png';
import { Link } from "react-router-dom";
import { slugify } from "@/utils/slugify";

export type Lang = "uz" | "ru" | "en";

export interface MultilingualText {
  uz?: string;
  ru?: string;
  en?: string;
}

export interface NewsCategory {
  id: number;
  name: MultilingualText;
}

export interface NewsItem {
  id: number;
  title: MultilingualText;
  image: string | null;
  description: MultilingualText;
  body: MultilingualText;
  category: NewsCategory;
}

const NewsSkeleton: React.FC = () => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-4 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-3 w-4/5"></div>
      <div className="h-3 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

const NewsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split("-")[0] as keyof MultilingualText;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: allNews = [], isLoading: newsLoading } = useGetNewsQuery({});
  const { data: categories = [] } = useGetNewsCategoriesQuery();

  const getText = (field: MultilingualText | null | undefined): string => {
    if (!field) return "";
    return field[lang] || field.en || "";
  };

  // Client-side filtering and pagination
  const { filteredNews, totalPages, currentNews } = useMemo(() => {
    let filtered = allNews;

    // Apply search filter
    if (search.trim()) {
      filtered = filtered.filter((item: NewsItem) => {
        const title = getText(item.title).toLowerCase();
        const description = getText(item.description).toLowerCase();
        const searchLower = search.toLowerCase();
        return title.includes(searchLower) || description.includes(searchLower);
      });
    }

    // Apply category filter
    if (category !== undefined) {
      filtered = filtered.filter((item: NewsItem) => item.category.id === category);
    }

    // Calculate pagination
    const total = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const current = filtered.slice(startIndex, endIndex);

    return {
      filteredNews: filtered,
      totalPages: total,
      currentNews: current,
    };
  }, [allNews, search, category, currentPage, itemsPerPage, lang]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value === "" ? undefined : Number(e.target.value);
    setCategory(selectedCategory);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 3; // Faqat 3 ta sahifa ko'rsatiladi

    // Previous button
    if (currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="flex items-center px-3 py-2 text-gray-500 hover:text-blue-500 hover:bg-orange-50 rounded-lg transition-colors duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="ml-1 hidden sm:inline">{t("media.previous")}</span>
        </button>
      );
    }

    // Birinchi sahifa
    buttons.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`px-3 py-2 rounded-lg transition-colors duration-200 ${currentPage === 1
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:text-sky-100 hover:bg-sky-400"
          }`}
      >
        1
      </button>
    );

    // Ellipsis (agar kerak bo'lsa)
    if (currentPage > maxVisiblePages) {
      buttons.push(
        <span key="start-ellipsis" className="px-3 py-2 text-gray-500">
          ...
        </span>
      );
    }

    // Joriy sahifa atrofidagi sahifalar
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-2 rounded-lg transition-colors duration-200 ${i === currentPage
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:text-sky-100 hover:bg-sky-400"
              }`}
          >
            {i}
          </button>
        );
      }
    }

    // Ellipsis (agar kerak bo'lsa)
    if (currentPage < totalPages - maxVisiblePages + 1) {
      buttons.push(
        <span key="end-ellipsis" className="px-3 py-2 text-gray-500">
          ...
        </span>
      );
    }

    // Oxirgi sahifa (agar 1 dan katta bo'lsa)
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-2 rounded-lg transition-colors duration-200 ${currentPage === totalPages
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:text-sky-100 hover:bg-sky-400"
            }`}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="flex items-center px-3 py-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors duration-200"
        >
          <span className="mr-1 hidden sm:inline">{t("media.next")}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      );
    }

    return buttons;
  };

  return (
    <div >
      <div className="max-w-[1800px] mx-auto px-4 md:px-[80px]">
        {/* Enhanced Filters */}
        <div   className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                placeholder={t("placeholder.news") || "Yangiliklar ichidan qidirish..."}
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white shadow-sm transition-all duration-200"
              />
            </div>

            <div className="relative min-w-[250px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={category ?? ""}
                onChange={handleCategoryChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white shadow-sm appearance-none cursor-pointer transition-all duration-200"
              >
                <option value="">{t("media.category") || "Barcha kategoriyalar"}</option>
                {categories.map((cat: NewsCategory) => (
                  <option key={cat.id} value={cat.id}>
                    {getText(cat.name)}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Results Count */}
        {!newsLoading && (
          <div className="mb-6 text-gray-600 text-sm">
            {filteredNews.length > 0 ? `${filteredNews.length} ta yangilik topildi` : "Yangilik topilmadi"}
            {search && ` "${search}" bo'yicha`}
            {category && categories.find(cat => cat.id === category) &&
              ` "${getText(categories.find(cat => cat.id === category)?.name)}" kategoriyasida`}
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {newsLoading
            ? Array.from({ length: 8 }).map((_, i) => <NewsSkeleton key={i} />)
            : currentNews.map((item: NewsItem) => (
              <Link to={`/media/news/detail/${item.id}-${slugify(item.title.uz || '')}`}>
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg hover:border-sky-200 transition-all duration-300 group cursor-pointer h-[430px]"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image || IMAGE}
                      alt={getText(item.title)}
                      onError={(e) => ((e.target as HTMLImageElement).src = IMAGE)}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900 text-white shadow-md">
                        <Tag className="w-3 h-3 mr-1" />
                        {getText(item.category.name)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                      {getText(item.title)}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {getText(item.description)}
                    </p>

                    {/* Read More Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sky-500 text-sm font-medium group-hover:text-sky-600 transition-colors duration-200">
                        {t('media.full')} →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {/* Pagination */}
        {!newsLoading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-1">
            <div className="flex items-center space-x-1 bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              {renderPaginationButtons()}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!newsLoading && currentNews.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('media.no_results')}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {t('media.no_results_hint')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;