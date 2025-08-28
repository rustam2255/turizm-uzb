import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import DocumentSkeleton from "@/components/ui/loaderSkleton/documentSkleton";
import {
  useGetDocumentCategoriesQuery,
  useGetDocumentsQuery,
} from "@/services/api";
import { Helmet } from "react-helmet-async";
const DocumentUI: React.FC = () => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language.split("-")[0] as "uz" | "ru" | "en";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {
    data: categories = [],
    isLoading: loadingCategories,
    isError: categoriesError,
  } = useGetDocumentCategoriesQuery();

  const {
    data: documents = [],
    isLoading: loadingDocuments,
    isError: documentsError,
  } = useGetDocumentsQuery({
    search: debouncedSearch,
    category: selectedCategoryId,
  });
  const metaKeywords = [
    "O‘zbekiston hujjatlari", "Uzbekistan documents", "Документы Узбекистан",
    "PDF download", "Rasmiy hujjatlar", "Government documents",
    "O‘zbekcha regulations", "Uzbek laws", "Legal documents Uzbekistan",
    "Tashkent documents", "Samarkand documents", "Document categories Uzbekistan",
    "PDF Uzbekistan", "PDF rasmiy", "Uzbekistan news PDF"
  ].join(", ");

  // Dynamic description
  const metaDescription =
    "O‘zbekiston rasmiy hujjatlari, kategoriyalari va PDF fayllarni tez va oson toping. Qidiruv va filtrlash funksiyalari bilan barcha rasmiy dokumentlar bir joyda.";

  return (
    <div
      className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1200px] ml-5    min-h-screen bg-gradient-to-br  relative overflow-hidden"
    >
      <Helmet>
        <title>{t("documents.title") || "O‘zbekiston Hujjatlari"}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <link rel="canonical" href={window.location.href} />
        {/* Open Graph */}
        <meta property="og:title" content={t("documents.title") || "O‘zbekiston Hujjatlari"} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("documents.title") || "O‘zbekiston Hujjatlari"} />
        <meta name="twitter:description" content={metaDescription} />
      </Helmet>
      <div className="relative z-10">
        {/* Breadcrumb */}
        <div
          className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2 mb-4"
        >
          <Link to="/" className="hover:underline transition-colors duration-200">
            {t("breadcrumb.home")}
          </Link>
          <span
          >
            &gt;
          </span>
          <span className=" font-semibold text-sky-900" >{t("breadcrumb.documents")}</span>
        </div>
        {/* Search Input */}
        <div
          className="mb-10"
        >
          <div className="relative w-full sm:w-2/3 lg:w-1/2">
            <input
              type="text"
              placeholder={t("documents.search_documents")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-sky-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100  px-6 py-3 text-sm outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-sky-900"
            />
            {/* Search icon */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sky-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div
          className="mb-12"
        >
          <h2
            className="text-xl font-semibold mb-6 text-sky-900"
          >
            {t("documents.categories")}
          </h2>

          <div className="flex flex-wrap gap-3">
            {/* Clear filter button */}
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`text-sm cursor-pointer px-4 py-2  transition-all duration-300 border-2 backdrop-blur-sm ${selectedCategoryId === null
                ? "bg-sky-500 text-white border-sky-500"
                : "bg-white/70 text-sky-600 hover:bg-sky-50 border-sky-200 hover:border-sky-300"
                }`}
            >
              {t("documents.all_categories") || "Barchasi"}
            </button>

            {loadingCategories ? (
              <div
                className="flex items-center gap-2 text-sky-600"
              >
                <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                <span>{t("loading")}</span>
              </div>
            ) : categoriesError ? (
              <p
                className="text-red-500 bg-red-50 px-4 py-2 rounded-full border border-red-200"
              >
                {t("documents.fetch_error")}
              </p>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`text-sm cursor-pointer px-4 py-2 rounded-full transition-all duration-300 border-2 backdrop-blur-sm ${selectedCategoryId === category.id
                    ? "bg-sky-500 text-white border-sky-500 "
                    : "bg-white/70 text-sky-600 hover:bg-sky-50 border-sky-200 hover:border-sky-300"
                    }`}
                >
                  {category.name[currentLang] || category.name.en}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Documents */}
        <AnimatePresence mode="wait">
          {loadingDocuments ? (
            <div
              key="loading"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array(6).fill(0).map((_, index) => (
                  <div
                    key={index}
                  >
                    <DocumentSkeleton />
                  </div>
                ))}
              </div>
            </div>
          ) : documentsError ? (
            <div
              key="error"
              className="text-center py-16"
            >
              <div className="bg-red-50 border-2 border-red-200  p-8 max-w-md mx-auto">
                <div className="text-red-500 text-lg font-medium mb-2">
                  {t("documents.fetch_error")}
                </div>
                <p className="text-red-400 text-sm">Iltimos, qaytadan urinib ko'ring</p>
              </div>
            </div>
          ) : documents.length === 0 ? (
            <div
              key="empty"
              className="text-center py-16"
            >
              <div className="bg-sky-50 border-2 border-sky-200  p-8 max-w-md mx-auto">
                <div className="text-sky-600 text-lg font-medium mb-2">
                  {t("documents.no_documents_found")}
                </div>
                <p className="text-sky-400 text-sm">Boshqa kategoriyadan qidiring</p>
              </div>
            </div>
          ) : (
            <div
              key="documents"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {documents.map((doc) => {
                const title = doc.title[currentLang] || doc.title.en;
                const link = doc.file ?? doc.url;
                return (
                  <div
                    key={doc.id}
                    className="border-2 border-sky-100 bg-white/80 backdrop-blur-sm   p-6 transition-all duration-300 group"
                  >
                    <h2
                      className="text-lg font-semibold text-sky-800 mb-4 group-hover:text-sky-600 transition-colors duration-300"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                    >
                      {title}
                    </h2>

                    <div className="space-y-3 mb-6">
                      <div
                        className="text-sm text-sky-600"
                      >
                        <span className="font-medium bg-sky-100 px-2 py-1">
                          {t("documents.number")}:
                        </span>{" "}
                        <span className="ml-1">{doc.number}</span>
                      </div>

                      <div
                        className="text-sm text-sky-500"
                      >
                        <span className="font-medium bg-sky-50 px-2 py-1 ">
                          {t("documents.date")}:
                        </span>{" "}
                        <span className="ml-1">{doc.date}</span>
                      </div>
                    </div>

                    {link && (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>{t("documents.view_document")}</span>
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DocumentUI;