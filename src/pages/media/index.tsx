import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import NewsPage from "./media-news";
import ArticlesPage from "./media-article";

const Media: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br ">
      <div className='max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Breadcrumb */}
        <nav className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2" aria-label="Breadcrumb">
          <Link
            to="/"
            className="hover:underline transition-all duration-200 text-gray-700 hover:text-[rgba(77,199,232,1)]"
          >
            {t("breadcrumb.home")}
          </Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="font-semibold" style={{ color: 'rgba(77,199,232,1)' }}>
            {t("media.title")}
          </span>
        </nav>

        {/* Main Layout - 60/40 split */}
        <div className="grid grid-cols-1 mt-5 lg:grid-cols-5 gap-8">
          {/* News Section - 60% */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3 order-1"
          >
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200/50 p-6 lg:p-8 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                {/* <div 
                  className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
                  style={{ 
                    background: `linear-gradient(135deg, rgba(77,199,232,0.1), rgba(77,199,232,0.2))`,
                    border: `1px solid rgba(77,199,232,0.3)`
                  }}
                >
                  <Newspaper 
                    className="w-7 h-7 transition-all duration-300" 
                    style={{ color: 'rgba(77,199,232,1)' }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 hover:scale-105 transition-transform duration-300">
                    {t('media.news')}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {t('media.import')}
                  </p>
                </div> */}
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
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200/50 backdrop-blur-sm sticky top-8 hover:shadow-xl transition-all duration-500">
              {/* <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
                    style={{ 
                      background: `linear-gradient(135deg, rgba(77,199,232,0.1), rgba(77,199,232,0.2))`,
                      border: `1px solid rgba(77,199,232,0.3)`
                    }}
                  >
                    <BookOpen 
                      className="w-7 h-7 transition-all duration-300" 
                      style={{ color: 'rgba(77,199,232,1)' }}
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 hover:scale-105 transition-transform duration-300">
                      {t('media.articles')}
                    </h2>
                  </div>
                </div>
              </div> */}
              
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
            background: linear-gradient(135deg, rgba(77,199,232,0.6), rgba(77,199,232,0.8));
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, rgba(77,199,232,0.8), rgba(77,199,232,1));
          }

          /* Enhanced hover effects for cards */
          .bg-white:hover {
            transform: translateY(-2px);
          }

          /* Custom blue accent animations */
          @keyframes blueGlow {
            0%, 100% {
              box-shadow: 0 0 5px rgba(77,199,232,0.3);
            }
            50% {
              box-shadow: 0 0 20px rgba(77,199,232,0.5), 0 0 30px rgba(77,199,232,0.3);
            }
          }

          .bg-white:hover {
            animation: blueGlow 2s ease-in-out infinite;
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

          /* Glass morphism effect with blue tint */
          .backdrop-blur-sm {
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            background: rgba(255, 255, 255, 0.9);
          }

          /* Blue accent for interactive elements */
          .hover\\:text-\\[rgba\\(77\\,199\\,232\\,1\\)\\]:hover {
            color: rgba(77,199,232,1) !important;
          }

          /* Custom blue gradient backgrounds */
          .blue-gradient-bg {
            background: linear-gradient(135deg, rgba(77,199,232,0.05), rgba(77,199,232,0.1));
          }

          /* Blue theme accents */
          .blue-accent-border {
            border: 1px solid rgba(77,199,232,0.2);
          }

          .blue-accent-shadow:hover {
            box-shadow: 0 10px 25px rgba(77,199,232,0.15);
          }
        `}</style>
      </div>
    </div>
  );
};

export default Media;