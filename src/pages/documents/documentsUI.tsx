import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div 
      className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1200px] ml-5    min-h-screen bg-gradient-to-br  relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[rgba(245, 245, 245, 1)] pointer-events-none">
        <motion.div 
          className="absolute top-20 -left-20 w-40 h-40  rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-20 -right-20 w-60 h-60 bg-blue-200/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -20, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10">
        {/* Breadcrumb */}
        <motion.div 
          className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link to="/" className="hover:underline transition-colors duration-200">
            {t("breadcrumb.home")}
          </Link>
          <motion.span 
            className=""
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            &gt;
          </motion.span>
          <span className=" font-semibold text-sky-900" >{t("breadcrumb.documents")}</span>
        </motion.div>

  

        {/* Search Input */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative w-full sm:w-2/3 lg:w-1/2">
            <motion.input
              type="text"
              placeholder={t("documents.search_documents")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-sky-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 rounded-2xl px-6 py-3 text-sm outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md placeholder-sky-900"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            {/* Search icon */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sky-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.h2 
            className="text-xl font-semibold mb-6 text-sky-900"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            {t("documents.categories")}
          </motion.h2>
          
          <div className="flex flex-wrap gap-3">
            {/* Clear filter button */}
            <motion.button
              onClick={() => setSelectedCategoryId(null)}
              className={`text-sm cursor-pointer px-4 py-2 rounded-full transition-all duration-300 border-2 backdrop-blur-sm ${
                selectedCategoryId === null
                  ? "bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-200"
                  : "bg-white/70 text-sky-600 hover:bg-sky-50 border-sky-200 hover:border-sky-300"
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {t("documents.all_categories") || "Barchasi"}
            </motion.button>

            {loadingCategories ? (
              <motion.div 
                className="flex items-center gap-2 text-sky-600"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                <span>{t("loading")}</span>
              </motion.div>
            ) : categoriesError ? (
              <motion.p 
                className="text-red-500 bg-red-50 px-4 py-2 rounded-full border border-red-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {t("documents.fetch_error")}
              </motion.p>
            ) : (
              categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`text-sm cursor-pointer px-4 py-2 rounded-full transition-all duration-300 border-2 backdrop-blur-sm ${
                    selectedCategoryId === category.id
                      ? "bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-200"
                      : "bg-white/70 text-sky-600 hover:bg-sky-50 border-sky-200 hover:border-sky-300"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {category.name[currentLang] || category.name.en}
                </motion.button>
              ))
            )}
          </div>
        </motion.div>

        {/* Documents */}
        <AnimatePresence mode="wait">
          {loadingDocuments ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array(6).fill(0).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <DocumentSkeleton />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : documentsError ? (
            <motion.div
              key="error"
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-red-500 text-lg font-medium mb-2">
                  {t("documents.fetch_error")}
                </div>
                <p className="text-red-400 text-sm">Iltimos, qaytadan urinib ko'ring</p>
              </div>
            </motion.div>
          ) : documents.length === 0 ? (
            <motion.div
              key="empty"
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-sky-600 text-lg font-medium mb-2">
                  {t("documents.no_documents_found")}
                </div>
                <p className="text-sky-400 text-sm">Boshqa kategoriyadan qidiring</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="documents"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {documents.map((doc, index) => {
                const title = doc.title[currentLang] || doc.title.en;
                const link = doc.file ?? doc.url;
                return (
                  <motion.div
                    key={doc.id}
                    className="border-2 border-sky-100 bg-white/80 backdrop-blur-sm shadow-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      y: -8,
                      scale: 1.02,
                      borderColor: "rgb(56 189 248)",
                      boxShadow: "0 20px 25px -5px rgba(56, 189, 248, 0.1), 0 10px 10px -5px rgba(56, 189, 248, 0.04)"
                    }}
                  >
                    <motion.h2 
                      className="text-lg font-semibold text-sky-800 mb-4 group-hover:text-sky-600 transition-colors duration-300"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                    >
                      {title}
                    </motion.h2>
                    
                    <div className="space-y-3 mb-6">
                      <motion.div 
                        className="text-sm text-sky-600"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="font-medium bg-sky-100 px-2 py-1 rounded-lg">
                          {t("documents.number")}:
                        </span>{" "}
                        <span className="ml-1">{doc.number}</span>
                      </motion.div>
                      
                      <motion.div 
                        className="text-sm text-sky-500"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="font-medium bg-sky-50 px-2 py-1 rounded-lg">
                          {t("documents.date")}:
                        </span>{" "}
                        <span className="ml-1">{doc.date}</span>
                      </motion.div>
                    </div>
                    
                    {link && (
                      <motion.a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>{t("documents.view_document")}</span>
                        <motion.svg 
                          className="w-4 h-4 ml-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </motion.svg>
                      </motion.a>
                    )}

                    {/* Decorative corner */}
                    <div className="absolute top-3 right-3 w-3 h-3 bg-gradient-to-br from-sky-300 to-cyan-300 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DocumentUI;