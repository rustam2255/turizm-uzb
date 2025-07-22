import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Newspaper } from "lucide-react";
import NewsPage from "./media-news";
import ArticlesPage from "./media-article";

const Media: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-[79px]  bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className='max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Breadcrumb */}
        <nav className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2" aria-label="Breadcrumb">
          <Link
            to="/"
            className="hover:text-orange-500 hover:underline transition-all duration-200"
          >
            {t("breadcrumb.home")}
          </Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-orange-500 font-semibold">
            {t("media.title")}
          </span>
        </nav>

        {/* Main Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            {t("media.title") || "Media Markaz"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {t('media.meet')}
          </motion.p>
        </div>

        {/* Main Layout - 60/40 split */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* News Section - 60% */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3 order-1"
          >
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200/50 p-6 lg:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
                  <Newspaper className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t('media.news')}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {t('media.import')}
                  </p>
                </div>
              </div>
              <NewsPage />
            </div>
          </motion.div>

          {/* Articles Section - 40% */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-2 order-2"
          >
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200/50 backdrop-blur-sm sticky top-8">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                    <BookOpen className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {t("media.title") || "Maqolalar"}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {t('media.articles')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                <ArticlesPage />
              </div>
            </div>
          </motion.div>
        </div>

       
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(241, 245, 249, 0.5);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #cbd5e1, #94a3b8);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #94a3b8, #64748b);
          }

          /* Enhanced responsive design */
          @media (max-width: 1024px) {
            .lg\\:col-span-3,
            .lg\\:col-span-2 {
              grid-column: span 1;
            }
          }

          /* Smooth animations */
          * {
            transition: all 0.2s ease-in-out;
          }

          /* Glass morphism effect */
          .backdrop-blur-sm {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
        `}</style>
      </div>
    </div>
  );
};

export default Media;