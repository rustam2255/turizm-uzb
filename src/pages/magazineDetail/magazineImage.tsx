// magazineImage.tsx - Tuzatilgan versiya
import { Dialog, Transition } from "@headlessui/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Fragment, useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import Image1 from "@assets/images/place1.png";
import Image2 from "@assets/images/place3.png";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  loading: boolean;
  error: boolean;
}

const SliderModal = ({ isOpen, onClose, images, loading, error }: Props) => {
  const fallbackImages = [Image1, Image2];
  const imageList = images && images.length > 0 ? images : fallbackImages;
  const [currentSlide, setCurrentSlide] = useState(0);

  // Debug uchun console.log qo'shish
  useEffect(() => {
    console.log("SliderModal props:", { 
      isOpen, 
      imagesLength: images?.length || 0, 
      loading, 
      error,
      images: images?.slice(0, 2) // Faqat birinchi 2 ta URL ni ko'rsatish
    });
  }, [isOpen, images, loading, error]);

  // Modal ochilganda slide ni reset qilish
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
    }
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  
                  <div className="text-sm text-gray-600 font-medium">
                    {!loading && !error && imageList && (
                      <span>{currentSlide + 1} / {imageList.length}</span>
                    )}
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all duration-200 group"
                  >
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-200" />
                  </button>
                </div>

                {/* Content */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100">
                  {loading ? (
                    <div className="flex items-center justify-center h-96 sm:h-[500px]">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
                          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-gray-600 font-medium">Rasmlar yuklanmoqda...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-96 sm:h-[500px]">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <X size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Xatolik yuz berdi</h3>
                        <p className="text-gray-600">Rasmlarni yuklab bo'lmadi. Iltimos, qaytadan urinib ko'ring.</p>
                        {/* Debug ma'lumoti */}
                        <p className="text-xs text-gray-400 mt-2">Debug: images count = {images?.length || 0}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Swiper faqat rasmlar bo'lganda render qilinadi */}
                      {imageList && imageList.length > 0 ? (
                        <Swiper
                          modules={[Navigation, Pagination, Autoplay, EffectFade]}
                          navigation={{
                            prevEl: '.swiper-button-prev-custom',
                            nextEl: '.swiper-button-next-custom',
                          }}
                          pagination={{
                            clickable: true,
                            bulletClass: 'swiper-pagination-bullet !w-3 !h-3 !bg-white !opacity-60',
                            bulletActiveClass: 'swiper-pagination-bullet-active !opacity-100 !bg-blue-500',
                          }}
                          spaceBetween={0}
                          slidesPerView={1}
                          autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                          }}
                          effect="fade"
                          fadeEffect={{
                            crossFade: true
                          }}
                          onSlideChange={(swiper) => {
                            console.log("Slide changed to:", swiper.activeIndex);
                            setCurrentSlide(swiper.activeIndex);
                          }}
                          className="h-96 sm:h-[500px] lg:h-[600px]"
                        >
                          {imageList.map((img, idx) => (
                            <SwiperSlide key={`slide-${idx}`}>
                              <div className="relative w-full h-full flex items-center justify-center p-4">
                                <img
                                  src={img}
                                  alt={`Rasm ${idx + 1}`}
                                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                  onError={(e) => {
                                    console.log("Image load error:", img);
                                    const target = e.target as HTMLImageElement;
                                    if (fallbackImages[0] && target.src !== fallbackImages[0]) {
                                      target.src = fallbackImages[0];
                                    }
                                  }}
                                  onLoad={() => {
                                    console.log("Image loaded successfully:", img);
                                  }}
                                />
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      ) : (
                        <div className="flex items-center justify-center h-96 sm:h-[500px]">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <span className="text-gray-400 text-2xl">🖼️</span>
                            </div>
                            <p className="text-gray-600">Rasmlar mavjud emas</p>
                          </div>
                        </div>
                      )}

                      {/* Custom Navigation Buttons - faqat rasmlar mavjud bo'lganda */}
                      {imageList && imageList.length > 1 && (
                        <>
                          <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all duration-200 backdrop-blur-sm">
                            <ChevronLeft size={24} />
                          </button>
                          <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all duration-200 backdrop-blur-sm">
                            <ChevronRight size={24} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {!loading && !error && (
                  <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 font-medium">Galereya</span>
                      </div>
                      
                      {/* Debug ma'lumoti */}
                      <div className="text-xs text-gray-400">
                        Rasmlar soni: {imageList?.length || 0}
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SliderModal;