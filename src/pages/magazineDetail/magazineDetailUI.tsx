import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import IMAGE from "@assets/images/samarkand-img.png";
import { useTranslation } from "react-i18next";
import { useGetMagazineBackgroundQuery, useGetMagazineByIdQuery, useGetMagazineImagesQuery } from "@/services/api";
import PdfToImage from "@/components/Pdf/PdfToImage";
import SliderModal from "./magazineImage";
import Logo from "@/assets/images/logo.png";
const BaseUrl = import.meta.env.VITE_API_MEDIA_URL
const MagazineDetailUI: React.FC = () => {
   const { idSlug } = useParams<{ idSlug: string }>();

  
  const magazineID = Number(idSlug?.split("-")[0]);
  
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0] as "uz" | "ru" | "en";

  const { data: magazine, error, isLoading } = useGetMagazineByIdQuery(magazineID, {
    skip: !magazineID,
  });
  const {data: magzineImage, error: imageError, isLoading: imagesLoading} = useGetMagazineImagesQuery({id: magazineID})
   const {data: backImage} = useGetMagazineBackgroundQuery()
  const [showPdf, setShowPdf] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);



  useEffect(() => {
    console.log("Modal state changed:", { isModalOpen });
  }, [isModalOpen]);

  const getLocalizedText = (
    field: { uz?: string; en?: string; ru?: string } | undefined
  ): string => {
    if (!field) return "";
    return field[currentLang] || field.en || "";
  };

  const handleImageClick = () => {
    console.log("Image clicked, opening modal...");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    console.log("Closing modal...");
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-4 text-[rgba(77,199,232,255)] rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 text-[rgba(77,199,232,255)] rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !magazine) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <p className="text-red-500 font-medium">Ma'lumot topilmadi.</p>
        </div>
      </div>
    );
  }

 
  const imagesList = magzineImage?.results?.map((item) => item.image) || [];
  const imageback = backImage?.file ? `${BaseUrl}${backImage.file}` : IMAGE;

  return (
    <div className="max-w-[1000px] ml-[90px] py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      {/* Breadcrumb */}
      <nav className="flex items-center text-[14px] font-medium md:text-[18px] gap-2 mb-8">
        <Link 
          to="/" 
          className="hover:underline text-gray-700 hover:blue-900 transition-colors duration-200"
        >
          {t("breadcrumb.home")}
        </Link>
        <span className="text-gray-400">&gt;</span>
        <Link 
          to="/magazines" 
          className="hover:underline text-blue-500  transition-colors duration-200"
        >
          {t("breadcrumb.magazines")}
        </Link>
      </nav>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
   
        <div className="p-6 sm:p-8 border-b border-gray-100">
          <h1 className="text-[24px] md:text-[32px] text-gray-900 font-bold leading-[110%] mb-3 animate-slideInLeft">
            {getLocalizedText(magazine.title)}
          </h1>
          <div className="inline-flex items-center px-3 py-1.5 bg-orange-50 text-sky-400 rounded-full text-[14px] font-semibold animate-slideInLeft delay-150">
            📅 {magazine.month}, {magazine.year}
          </div>
        </div>


        <div className="p-6 sm:p-8">
     
          <div className="group relative mb-8  bg-cover bg-no-repeat bg-center   animate-slideInUp" style={{ backgroundImage: `url(${imageback})` }}>
            <div className="absolute top-3 left-2">
              <img src={Logo} alt="" className="w-auto h-auto max-h-[50px] sm:max-h-[60px] md:max-h-[50px]"/>
            </div>
            <div className="overflow-hiddenrounded-xl shadow-lg  group-hover:shadow-xl transition-shadow duration-300">
              <img
                src={magazine.card || IMAGE}
                alt={getLocalizedText(magazine.title)}
                className="w-fit mx-auto max-h-[500px] p-5 rounded-xl   hover:cursor-pointer  group-hover:scale-105 transition-transform duration-500"
                onClick={handleImageClick}
                onError={(e) => ((e.target as HTMLImageElement).src = IMAGE)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-gray-800 font-medium transform scale-90 group-hover:scale-100 transition-transform duration-300 hover:cursor-pointer" onClick={handleImageClick}>
                  🔍 {t('magazine.see')}
                </div>
              </div>
            </div>
          </div>
    
          <div className="mb-8 animate-slideInUp delay-200">
            <h2 className="text-[20px] font-semibold text-gray-900 mb-4">{t('magazine.ts')}</h2>
            <p className="text-gray-700 text-[16px] md:text-[18px] leading-[140%] tracking-wide bg-gray-50 p-6 rounded-lg border-l-4 border-[rgba(77,199,232,1)]">
              {getLocalizedText(magazine.description)}
            </p>
          </div>

     
          <div className="animate-slideInUp delay-300">
            {!showPdf ? (
              <div className="text-center">
                <button
                  onClick={() => setShowPdf(true)}
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-sky-900 to-sky-400 text-white px-8 py-4 rounded-xl font-semibold text-[16px] hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">📄</span>
                  {t("magazine.view_pdf")}
                  <svg 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 animate-slideInUp">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 font-medium">{t("magazine.see_pdf")}</span>
                </div>
                <PdfToImage fileUrl={magazine.file} />
              </div>
            )}
          </div>
        </div>
      </div>

    
      <SliderModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        images={imagesList}
        loading={imagesLoading}
        error={Boolean(imageError)}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        
        @keyframes slideInUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out;
        }
        
        .delay-150 {
          animation-delay: 150ms;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};

export default MagazineDetailUI;