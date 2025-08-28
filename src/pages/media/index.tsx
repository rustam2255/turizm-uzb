import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import NewsPage from "./media-news";
import ArticlesPage from "./media-article";
const Media: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav
          className="flex items-center t  ext-[14px] font-sans font-medium md:text-[18px] gap-2"
          aria-label="Breadcrumb"
        >
          <Link
            to="/"
            className="text-gray-700 dark:text-white  transition-colors duration-200"
          >
            {t("breadcrumb.home")}
          </Link>
          <span className="mx-2 text-black dark:text-white">&gt;</span>
          <span className="font-semibold text-sky-900">
            {t("media.title")}
          </span>
        </nav>

        {/* Main Layout - 60/40 split */}
        <div className="grid grid-cols-1 mt-5 lg:grid-cols-5 gap-8">
          {/* News Section - 60% */}
          <div
            className="lg:col-span-3 order-1"
          >
            <div className="shadow-lg border border-gray-200/50 dark:border-gray-500/50 p-3 lg:p-2 backdrop-blur-sm bg-white/90 dark:bg-transparent hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                {/* Ikonka va sarlavha joyi (agar kerak bo'lsa) */}
                {/* <div className="p-3 rounded-xl bg-[rgba(77,199,232,0.1)] border border-[rgba(77,199,232,0.3)] hover:scale-105 transition-transform duration-300 dark:bg-[rgba(77,199,232,0.2)] dark:border-[rgba(77,199,232,0.4)]">
                  <Newspaper
                    className="w-7 h-7 text-[rgba(77,199,232,1)]"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white hover:scale-105 transition-transform duration-300">
                    {t("media.news")}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t("media.import")}
                  </p>
                </div> */}
              </div>
              <NewsPage />
            </div>
          </div>

          {/* Articles Section - 40% */}
          <div
            className="lg:col-span-2 order-2"
          >
            <div className="bg-white/90 dark:bg-transparent  shadow-lg border border-gray-200/50 dark:border-gray-500/50 backdrop-blur-sm sticky top-8 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500">
              {/* Sarlavha joyi (agar kerak bo'lsa) */}
              {/* <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-xl bg-[rgba(77,199,232,0.1)] border border-[rgba(77,199,232,0.3)] hover:scale-105 transition-transform duration-300 dark:bg-[rgba(77,199,232,0.2)] dark:border-[rgba(77,199,232,0.4)]">
                    <BookOpen
                      className="w-7 h-7 text-[rgba(77,199,232,1)]"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white hover:scale-105 transition-transform duration-300">
                      {t("media.articles")}
                    </h2>
                  </div>
                </div>
              </div> */}
              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                <ArticlesPage />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          /* Custom scrollbar */
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
          .dark .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(30, 41, 59, 0.5);
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, rgba(77,199,232,0.7), rgba(77,199,232,0.9));
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, rgba(77,199,232,0.9), rgba(77,199,232,1));
          }

          /* Custom blue glow animation */
          @keyframes blueGlow {
            0%, 100% {
              box-shadow: 0 0 5px rgba(77,199,232,0.3);
            }
            50% {
              box-shadow: 0 0 20px rgba(77,199,232,0.5), 0 0 30px rgba(77,199,232,0.3);
            }
          }
          @keyframes blueGlowDark {
            0%, 100% {
              box-shadow: 0 0 5px rgba(77,199,232,0.4);
            }
            50% {
              box-shadow: 0 0 20px rgba(77,199,232,0.6), 0 0 30px rgba(77,199,232,0.4);
            }
          }
          .hover\\:shadow-glow:hover {
            animation: blueGlow 2s ease-in-out infinite;
          }
          .dark .hover\\:shadow-glow:hover {
            animation: blueGlowDark 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Media;