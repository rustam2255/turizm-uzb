import {
  ArrowLeft,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetNewsByIdQuery } from '@/services/api';
import IMAGE from '@/assets/images/place3.png'
import { stripHtmlTags } from '@/utils/getHtmlTags';
const NewsDetailPage = () => {
  const { idSlug } = useParams<{ idSlug: string }>();
  const newId = Number(idSlug?.split("-")[0]);
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language as 'uz' | 'en' | 'ru';
  const { data: newData, isLoading, isError } = useGetNewsByIdQuery(newId);

  const mockImage = IMAGE;
  if (isLoading) {
    return (  
      <div className="max-w-[1500px] mx-auto p-8 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-80 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }
  if (isError || !newData) {
    return (
      <div className="max-w-[1500px] mx-auto p-16 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('article_not_found')}</h2>
        <p className="text-gray-600 mb-6">{t('article_not_exist')}</p>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('go_back')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto pt-[79px] bg-white min-h-screen">
      <div className="px-6 py-10">
         <div className="flex items-center text-[14px] font-sans font-medium md:text-[18px] gap-2">
        <Link to="/" className="hover:underline text-black">{t("breadcrumb.home")}</Link>
        <span className="text-black">&gt;</span>
        <Link to="/services" className="hover:underline text-black">{t("services.title")}</Link>
        <span className="text-black">&gt;</span>
        <Link to="/services/resort" className="hover:underline text-black">{t("media.title")}</Link>
      </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {newData.title[currentLang]}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {newData.description[currentLang]}
        </p>

        <div className="mb-10">
          <img
            src={newData.image || mockImage}
            alt="Article"
            className="w-full h-[400px] rounded-2xl object-cover shadow-lg"
          />
        </div>

        {/* Body */}
        <div className="prose prose-lg max-w-none">
          {stripHtmlTags(newData.body[currentLang])}
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
