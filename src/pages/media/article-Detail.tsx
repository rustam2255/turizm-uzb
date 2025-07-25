import {
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetArticleByIdQuery } from '@/services/api';
import IMAGE from '@/assets/images/place3.png'
import { stripHtmlTags } from '@/utils/getHtmlTags';

const ArticleDetail = () => {
  const { idSlug } = useParams<{ idSlug: string }>();
  const articleId = Number(idSlug?.split("-")[0]);
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language as 'uz' | 'en' | 'ru';
  const { data: article, isLoading, isError } = useGetArticleByIdQuery(articleId);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang + '-' + currentLang.toUpperCase(), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const mockImage = IMAGE;

  if (isLoading) {
    return (
      <div className="max-w-[1500px] mx-auto p-8">
        {/* Animated skeleton loader */}
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded w-1/3"></div>
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded w-2/3"></div>
          <div className="h-80 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded-2xl"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="max-w-[1500px] mx-auto p-16 text-center">
        <div className="animate-[bounce_2s_infinite] text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-[fadeInUp_0.6s_ease-out]">
          {t('article_not_found')}
        </h2>
        <p className="text-gray-600 mb-6 animate-[fadeInUp_0.6s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">
          {t('article_not_exist')}
        </p>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-[fadeInUp_0.6s_ease-out_0.4s] opacity-0 [animation-fill-mode:forwards]"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          {t('go_back')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] ml-5 bg-white min-h-screen">
      <div className="px-6 py-10">
        {/* Animated breadcrumbs */}
        <div className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2 animate-[slideInLeft_0.6s_ease-out]">
          <Link 
            to="/" 
            className="hover:underline text-black transition-all duration-300 hover:text-blue-600 hover:scale-105"
          >
            {t("breadcrumb.home")}
          </Link>
          <span className="text-black transition-all duration-300">&gt;</span>
          <Link 
            to="/services" 
            className="hover:underline text-black transition-all duration-300 hover:text-blue-600 hover:scale-105"
          >
            {t("services.title")}
          </Link>
          <span className="text-black transition-all duration-300">&gt;</span>
          <Link 
            to="/services/resort" 
            className="hover:underline text-black transition-all duration-300 hover:text-blue-600 hover:scale-105"
          >
            {t("media.title")}
          </Link>
        </div>

        {/* Animated title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-[fadeInUp_0.8s_ease-out_0.2s] opacity-0 [animation-fill-mode:forwards]">
          {article.title[currentLang]}
        </h1>

        {/* Animated description */}
        <p className="text-lg text-gray-600 mb-6 animate-[fadeInUp_0.8s_ease-out_0.4s] opacity-0 [animation-fill-mode:forwards]">
          {article.description[currentLang]}
        </p>

        {/* Animated meta info */}
        <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm border-y py-4 mb-8 animate-[fadeInUp_0.8s_ease-out_0.6s] opacity-0 [animation-fill-mode:forwards]">
          <div className="flex items-center gap-2 group">
            <img
              src={article.author_photo || IMAGE}
              alt="Article"
              className="w-[50px] h-[50px] rounded-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
            />
            <span className="transition-all duration-300 group-hover:text-gray-700">
              {article.author}
            </span>
          </div>
          <div className="flex items-center gap-2 group">
            <Calendar className="w-4 h-4 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-110" /> 
            <span className="transition-all duration-300 group-hover:text-gray-700">
              {formatDate(article.created_at)}
            </span>
          </div>
        </div>

        {/* Animated image with hover effects */}
        <div className="mb-10 animate-[fadeInUp_0.8s_ease-out_0.8s] opacity-0 [animation-fill-mode:forwards]">
          <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group">
            <img
              src={article.article_image || mockImage}
              alt="Article"
              className="w-full h-[400px] object-cover transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </div>
        </div>

        {/* Animated content body */}
        <div className="prose prose-lg max-w-none animate-[fadeInUp_1s_ease-out_1s] opacity-0 [animation-fill-mode:forwards]">
          <div className="leading-relaxed text-gray-800 [&>p]:mb-6 [&>p]:transition-all [&>p]:duration-300 [&>p:hover]:text-gray-900">
            {stripHtmlTags(article.body[currentLang])}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -30px, 0);
          }
          70% {
            transform: translate3d(0, -15px, 0);
          }
          90% { 
            transform: translate3d(0, -4px, 0);
          }
        }
      `}</style>
    </div>
  );  
};

export default ArticleDetail;