import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DocumentSkeleton from "@/components/ui/loaderSkleton/documentSkleton";
import {
  useGetDocumentCategoriesQuery,
  useGetDocumentsQuery,
} from "@/services/api";

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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto font-serif">
      <div className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2">
        <Link to="/" className="hover:underline text-black">
          {t("breadcrumb.home")}
        </Link>
        <span className="text-black">&gt;</span>
        <span className="text-[#DE5D26]">{t("breadcrumb.documents")}</span>
      </div>

      <h1 className="text-[20px] md:text-[32px] font-serif mt-2 md:mt-5 mb-[14px]">
        {t("documents.tourism_laws")}
      </h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder={t("documents.search_documents")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-2/3 lg:w-1/2 border border-gray-300 focus:border-[#DE5D26] focus:ring-[#DE5D26] rounded-md px-4 py-2 text-sm outline-none transition duration-200"
        />
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          {t("documents.categories")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {loadingCategories ? (
            <p>{t("loading")}</p>
          ) : categoriesError ? (
            <p className="text-red-500">{t("documents.fetch_error")}</p>
          ) : (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`text-sm cursor-pointer px-3 py-1 rounded-full transition border ${
                  selectedCategoryId === category.id
                    ? "bg-[#DE5D26] text-white border-[#DE5D26]"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
                }`}
              >
                {category.name[currentLang] || category.name.en}
              </button>
            ))
          )}
        </div>
      </div>

      {loadingDocuments ? (
        <DocumentSkeleton />
      ) : documentsError ? (
        <p className="text-center text-red-500">{t("documents.fetch_error")}</p>
      ) : documents.length === 0 ? (
        <p className="text-sm text-gray-500">{t("documents.no_documents_found")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {documents.map((doc) => {
            const title = doc.title[currentLang] || doc.title.en;
            const link = doc.file ?? doc.url;
            return (
              <div
                key={doc.id}
                className="border border-gray-100 shadow-sm rounded-lg p-5 hover:shadow-md transition duration-200"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">{t("documents.number")}:</span>{" "}
                  {doc.number}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  <span className="font-medium">{t("documents.date")}:</span>{" "}
                  {doc.date}
                </div>
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#DE5D26] hover:bg-[#c84e1f] text-white text-sm font-medium px-4 py-2 rounded transition duration-200"
                  >
                    {t("documents.view_document")}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentUI;
