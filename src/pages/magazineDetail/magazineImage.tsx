// magazineImage.tsx - Moslashuvchan jurnal uslubi (Enhanced version)
import { Dialog, Transition } from "@headlessui/react";
import { X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Fragment, useState, useEffect } from "react";

import Image1 from "@assets/images/place1.png";
import Image2 from "@assets/images/place3.png";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  loading: boolean;
  error: boolean;
}

const MagazineStyleSlider = ({ isOpen, onClose, images, loading, error }: Props) => {
  const fallbackImages = [Image1, Image2];
  const imageList = images && images.length > 0 ? images : fallbackImages;
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');

  // Debug uchun console.log
  useEffect(() => {
    console.log("MagazineStyleSlider props:", { 
      isOpen, 
      imagesLength: images?.length || 0, 
      loading, 
      error,
      images: images?.slice(0, 2)
    });
  }, [isOpen, images, loading, error]);

  // Modal ochilganda sahifani reset qilish
  useEffect(() => {
    if (isOpen) {
      setCurrentSpread(0);
      setIsFlipping(false);
    }
  }, [isOpen]);

  // Spread strukturani hisoblash
  const getSpreadStructure = () => {
    if (imageList.length <= 1) {
      return [{ type: 'single', images: imageList, startIndex: 0 }];
    }

    const spreads = [];
    
    // Birinchi sahifa yakka
    spreads.push({ 
      type: 'single', 
      images: [imageList[0]], 
      startIndex: 0 
    });

    // O'rtadagi sahifalar juftlik
    let index = 1;
    while (index < imageList.length - 1) {
      if (index + 1 < imageList.length - 1) {
        // Ikkala rasm ham oxirgi emas
        spreads.push({ 
          type: 'double', 
          images: [imageList[index], imageList[index + 1]], 
          startIndex: index 
        });
        index += 2;
      } else {
        // Faqat bitta rasm qoldi (oxirgidan oldingi)
        spreads.push({ 
          type: 'single', 
          images: [imageList[index]], 
          startIndex: index 
        });
        index += 1;
      }
    }

    // Oxirgi sahifa yakka (agar qolgan bo'lsa)
    if (index < imageList.length) {
      spreads.push({ 
        type: 'single', 
        images: [imageList[index]], 
        startIndex: index 
      });
    }

    return spreads;
  };

  const spreads = getSpreadStructure();
  const totalSpreads = spreads.length;
  const currentSpreadData = spreads[currentSpread];

  // Spread o'zgartirish funksiyasi
  const changeSpread = (newSpread: number, direction: 'next' | 'prev') => {
    if (isFlipping || newSpread < 0 || newSpread >= totalSpreads) return;
    
    setIsFlipping(true);
    setFlipDirection(direction);
    
    setTimeout(() => {
      setCurrentSpread(newSpread);
      setTimeout(() => {
        setIsFlipping(false);
      }, 800);
    }, 400);
  };

  const nextSpread = () => {
    if (currentSpread < totalSpreads - 1) {
      changeSpread(currentSpread + 1, 'next');
    }
  };

  const prevSpread = () => {
    if (currentSpread > 0) {
      changeSpread(currentSpread - 1, 'prev');
    }
  };

  const goToSpread = (spreadIndex: number) => {
    if (spreadIndex !== currentSpread) {
      const direction = spreadIndex > currentSpread ? 'next' : 'prev';
      changeSpread(spreadIndex, direction);
    }
  };

  // Modal yopish - faqat X tugmasi orqali
  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Modal yopilmasini ta'minlash
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}} static>
        {/* Backdrop - bosilganda modal yopilmaydi */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div 
            className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />
        </Transition.Child>

        <div className="fixed inset-0 pt-[71px] overflow-hidden" onClick={handleBackdropClick}>
          <div className="flex min-h-full items-center justify-center p-1 sm:p-2 md:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 rotate-1"
              enterTo="opacity-100 scale-100 rotate-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 rotate-0"
              leaveTo="opacity-0 scale-95 rotate-1"
            >
              <Dialog.Panel 
                className="w-full h-full max-w-full max-h-full md:max-w-7xl md:h-auto transform overflow-hidden transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                
                {/* Magazine header */}
                <div className="relative mb-2 md:mb-4">
                  <div className="bg-gradient-to-r from-slate-800 to-gray-800 rounded-t-none md:rounded-t-xl px-3 md:px-6 py-2 md:py-4 shadow-xl border-b-2 md:border-b-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="text-blue-400 font-bold text-lg md:text-xl">📰 GALEREYA</div>
                        <div className="text-slate-300 text-xs md:text-sm">MAGAZINE</div>
                      </div>
                      
                      <div className="text-slate-300 font-medium text-xs md:text-base">
                        {!loading && !error && imageList && (
                          <span className="hidden sm:inline">
                            {currentSpreadData?.type === 'single' 
                              ? `Sahifa ${currentSpreadData.startIndex + 1}` 
                              : `Sahifalar ${currentSpreadData.startIndex + 1}-${currentSpreadData.startIndex + 2}`
                            } / {imageList.length}
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={onClose}
                        className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-700 text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-200 group"
                      >
                        <X size={16} className="md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Magazine content */}
                <div className="relative bg-white rounded-none md:rounded-xl shadow-2xl border border-gray-200 overflow-hidden">

                  {loading ? (
                    <div className="flex items-center justify-center h-[60vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] xl:h-[800px]">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <RotateCcw className="w-8 h-8 md:w-12 md:h-12 text-blue-600 animate-spin" />
                        </div>
                        <p className="text-gray-600 font-medium text-base md:text-lg">Jurnal ochilmoqda...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] xl:h-[800px]">
                      <div className="text-center px-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-200">
                          <X size={32} className="md:w-10 md:h-10 text-red-600" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Sahifalar yuklanmadi</h3>
                        <p className="text-gray-600 text-sm md:text-base">Jurnal sahifalarini ochib bo'lmadi.</p>
                        <p className="text-xs text-gray-500 mt-2">Debug: rasmlar soni = {images?.length || 0}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative book-container">
                      {imageList && imageList.length > 0 ? (
                        <div className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] xl:h-[800px] book-viewer">
                          
                          {/* Magazine spread container */}
                          <div 
                            className={`
                              absolute inset-0 flex book-spread transition-all duration-700 transform-gpu
                              ${isFlipping ? (
                                flipDirection === 'next' 
                                  ? 'animate-realistic-page-flip-next' 
                                  : 'animate-realistic-page-flip-prev'
                              ) : ''}
                            `}
                            style={{
                              perspective: '1500px',
                              transformStyle: 'preserve-3d'
                            }}
                          >
                            
                            {currentSpreadData?.type === 'single' ? (
                              // Yakka sahifa - kitob uslubida
                              <div className="w-full h-full relative bg-white shadow-2xl flex items-center justify-center book-page-single">
                                <div className="w-full max-w-3xl h-full p-3 md:p-6 lg:p-8 flex flex-col">
                                  <div className="flex-1 flex items-center justify-center overflow-hidden">
                                    <img
                                      src={currentSpreadData.images[0]}
                                      alt={`Sahifa ${currentSpreadData.startIndex + 1}`}
                                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                                      onError={(e) => {
                                        console.log("Single image load error:", currentSpreadData.images[0]);
                                        const target = e.target as HTMLImageElement;
                                        if (fallbackImages[0] && target.src !== fallbackImages[0]) {
                                          target.src = fallbackImages[0];
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="text-center text-gray-500 text-sm font-medium mt-2 md:mt-4">
                                    {currentSpreadData.startIndex + 1}
                                  </div>
                                </div>
                                {/* Sahifa egri chizig'i */}
                                <div className="absolute right-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 rounded-full shadow-inner"></div>
                              </div>
                            ) : (
                              // Juft sahifa - haqiqiy kitob kabi
                              <>
                                {/* Chap sahifa */}
                                <div className="w-1/2 h-full relative bg-white border-r border-gray-300 shadow-2xl book-page-left">
                                  {/* Ichki soya */}
                                  <div className="absolute right-0 top-0 bottom-0 w-12 md:w-16 bg-gradient-to-l from-gray-200/60 via-gray-100/30 to-transparent pointer-events-none book-inner-shadow"></div>
                                  
                                  <div className="w-full h-full p-2 md:p-4 lg:p-6 pr-6 md:pr-8 lg:pr-10 flex flex-col">
                                    <div className="flex-1 flex items-center justify-center overflow-hidden">
                                      <img
                                        src={currentSpreadData.images[0]}
                                        alt={`Sahifa ${currentSpreadData.startIndex + 1}`}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                                        onError={(e) => {
                                          console.log("Left image load error:", currentSpreadData.images[0]);
                                          const target = e.target as HTMLImageElement;
                                          if (fallbackImages[0] && target.src !== fallbackImages[0]) {
                                            target.src = fallbackImages[0];
                                          }
                                        }}
                                      />
                                    </div>
                                    <div className="text-center text-gray-500 text-xs md:text-sm font-medium mt-2">
                                      {currentSpreadData.startIndex + 1}
                                    </div>
                                  </div>
                                </div>

                                {/* O'ng sahifa */}
                                <div className="w-1/2 h-full relative bg-white shadow-2xl book-page-right">
                                  {/* Ichki soya */}
                                  <div className="absolute left-0 top-0 bottom-0 w-12 md:w-16 bg-gradient-to-r from-gray-200/60 via-gray-100/30 to-transparent pointer-events-none book-inner-shadow"></div>
                                  
                                  <div className="w-full h-full p-2 md:p-4 lg:p-6 pl-6 md:pl-8 lg:pl-10 flex flex-col">
                                    <div className="flex-1 flex items-center justify-center overflow-hidden">
                                      <img
                                        src={currentSpreadData.images[1]}
                                        alt={`Sahifa ${currentSpreadData.startIndex + 2}`}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                                        onError={(e) => {
                                          console.log("Right image load error:", currentSpreadData.images[1]);
                                          const target = e.target as HTMLImageElement;
                                          if (fallbackImages[1] && target.src !== fallbackImages[1]) {
                                            target.src = fallbackImages[1];
                                          }
                                        }}
                                      />
                                    </div>
                                    <div className="text-center text-gray-500 text-xs md:text-sm font-medium mt-2">
                                      {currentSpreadData.startIndex + 2}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Navigation tugmalari - responsive */}
                          <button 
                            onClick={prevSpread}
                            disabled={currentSpread === 0 || isFlipping}
                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-slate-800/90 hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
                          >
                            <ChevronLeft size={20} className="md:w-7 md:h-7" />
                          </button>
                          
                          <button 
                            onClick={nextSpread}
                            disabled={currentSpread === totalSpreads - 1 || isFlipping}
                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 bg-slate-800/90 hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
                          >
                            <ChevronRight size={20} className="md:w-7 md:h-7" />
                          </button>

                          {/* Center binding line - juft sahifalar uchun */}
                          {currentSpreadData?.type === 'double' && (
                            <div className="absolute left-1/2 top-0 bottom-0 w-1 md:w-2 bg-gradient-to-b from-gray-300 via-gray-500 to-gray-300 transform -translate-x-1/2 z-10 shadow-lg book-spine"></div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] xl:h-[800px]">
                          <div className="text-center px-4">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-gray-200">
                              <span className="text-gray-400 text-2xl md:text-3xl">📰</span>
                            </div>
                            <p className="text-gray-600 text-base md:text-lg font-medium">Jurnal bo'sh</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Magazine pastki qismi - spreads carousel */}
                {!loading && !error && imageList && totalSpreads > 1 && (
                  <div className="mt-2 md:mt-6 bg-gradient-to-r from-slate-800 to-gray-800 rounded-none md:rounded-xl p-2 md:p-4 shadow-xl">
                    <div className="flex items-center justify-center space-x-2 md:space-x-3">
                      
                      {/* Spreads indicators */}
                      <div className="flex items-center space-x-1 md:space-x-2 bg-slate-900/50 rounded-full px-2 md:px-4 py-1 md:py-2 overflow-x-auto max-w-full">
                        {spreads.map((spread, index) => (
                          <button
                            key={index}
                            onClick={() => goToSpread(index)}
                            disabled={isFlipping}
                            className={`
                              relative transition-all duration-300 transform flex-shrink-0
                              ${spread.type === 'single' 
                                ? 'w-6 h-2 md:w-8 md:h-3' 
                                : 'w-8 h-2 md:w-12 md:h-3'
                              } rounded-full
                              ${index === currentSpread 
                                ? 'bg-blue-400 scale-110 shadow-lg' 
                                : 'bg-slate-600 hover:bg-slate-500 hover:scale-105'
                              }
                              ${isFlipping ? 'cursor-not-allowed' : 'cursor-pointer'}
                            `}
                          >
                            {spread.type === 'double' && (
                              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300/50 transform -translate-x-1/2"></div>
                            )}
                            <span className="sr-only">
                              {spread.type === 'single' 
                                ? `Sahifa ${spread.startIndex + 1}` 
                                : `Sahifalar ${spread.startIndex + 1}-${spread.startIndex + 2}`
                              }
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Sahifalar soni */}
                      <div className="text-slate-300 text-xs md:text-sm font-medium flex-shrink-0">
                        {imageList.length} sahifa
                      </div>
                    </div>
                  </div>
                )}

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        {/* Enhanced Custom styles for realistic book page flip animation */}
        <style jsx>{`
          .book-container {
            transform-style: preserve-3d;
          }
          
          .book-viewer {
            background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 8px;
            box-shadow: 
              inset 0 2px 4px rgba(0,0,0,0.1),
              0 8px 32px rgba(0,0,0,0.15);
          }
          
          .book-spread {
            transform-style: preserve-3d;
          }
          
          .book-page-single {
            border-radius: 8px;
            box-shadow: 
              0 4px 20px rgba(0,0,0,0.15),
              inset 0 1px 0 rgba(255,255,255,0.6);
            background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
          }
          
          .book-page-left {
            border-radius: 8px 0 0 8px;
            box-shadow: 
              -2px 0 10px rgba(0,0,0,0.1),
              0 4px 20px rgba(0,0,0,0.15),
              inset 0 1px 0 rgba(255,255,255,0.6);
            background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
          }
          
          .book-page-right {
            border-radius: 0 8px 8px 0;
            box-shadow: 
              2px 0 10px rgba(0,0,0,0.1),
              0 4px 20px rgba(0,0,0,0.15),
              inset 0 1px 0 rgba(255,255,255,0.6);
            background: linear-gradient(225deg, #ffffff 0%, #fafafa 100%);
          }
          
          .book-inner-shadow {
            opacity: 0.8;
          }
          
          .book-spine {
            background: linear-gradient(180deg, 
              rgba(107, 114, 128, 0.3) 0%,
              rgba(107, 114, 128, 0.6) 50%,
              rgba(107, 114, 128, 0.3) 100%
            );
            border-radius: 1px;
          }
          
          @keyframes realistic-page-flip-next {
            0% { 
              transform: perspective(1500px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1);
              opacity: 1;
              filter: brightness(1);
            }
            25% { 
              transform: perspective(1500px) rotateY(-25deg) rotateX(-3deg) scale3d(0.95, 0.98, 1);
              opacity: 0.9;
              filter: brightness(0.9);
            }
            50% { 
              transform: perspective(1500px) rotateY(-45deg) rotateX(-5deg) scale3d(0.9, 0.95, 1);
              opacity: 0.7;
              filter: brightness(0.8);
            }
            75% { 
              transform: perspective(1500px) rotateY(25deg) rotateX(3deg) scale3d(0.95, 0.98, 1);
              opacity: 0.9;
              filter: brightness(0.9);
            }
            100% { 
              transform: perspective(1500px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1);
              opacity: 1;
              filter: brightness(1);
            }
          }
          
          @keyframes realistic-page-flip-prev {
            0% { 
              transform: perspective(1500px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1);
              opacity: 1;
              filter: brightness(1);
            }
            25% { 
              transform: perspective(1500px) rotateY(25deg) rotateX(3deg) scale3d(0.95, 0.98, 1);
              opacity: 0.9;
              filter: brightness(0.9);
            }
            50% { 
              transform: perspective(1500px) rotateY(45deg) rotateX(5deg) scale3d(0.9, 0.95, 1);
              opacity: 0.7;
              filter: brightness(0.8);
            }
            75% { 
              transform: perspective(1500px) rotateY(-25deg) rotateX(-3deg) scale3d(0.95, 0.98, 1);
              opacity: 0.9;
              filter: brightness(0.9);
            }
            100% { 
              transform: perspective(1500px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1);
              opacity: 1;
              filter: brightness(1);
            }
          }
          
          .animate-realistic-page-flip-next {
            animation: realistic-page-flip-next 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          
          .animate-realistic-page-flip-prev {
            animation: realistic-page-flip-prev 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          
          /* Mobile optimizations */
          @media (max-width: 768px) {
            .book-page-left,
            .book-page-right {
              box-shadow: 
                0 2px 10px rgba(0,0,0,0.1),
                inset 0 1px 0 rgba(255,255,255,0.6);
            }
            
            .book-inner-shadow {
              opacity: 0.6;
            }
          }
          
          /* High-resolution displays */
          @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .book-viewer {
              box-shadow: 
                inset 0 1px 2px rgba(0,0,0,0.1),
                0 4px 16px rgba(0,0,0,0.15);
            }
          }
        `}</style>
      </Dialog>
    </Transition>
  );
};

export default MagazineStyleSlider;