
import { Dialog, Transition } from "@headlessui/react";
import { X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Fragment, useState, useEffect, useRef, useCallback, useMemo } from "react";

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
  const [pageShaking, setPageShaking] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>([]);
  const [dragPosition, setDragPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Dinamik sahifa tuzilishi
  const spreads = useMemo(() => {
    if (imageList.length <= 1) {
      return [{ type: 'single', images: imageList, startIndex: 0 }];
    }

    const spreads = [];
    spreads.push({ type: 'single', images: [imageList[0]], startIndex: 0 });

    let index = 1;
    while (index < imageList.length - 1) {
      if (index + 1 < imageList.length - 1) {
        spreads.push({
          type: 'double',
          images: [imageList[index], imageList[index + 1]],
          startIndex: index,
        });
        index += 2;
      } else {
        spreads.push({ type: 'single', images: [imageList[index]], startIndex: index });
        index += 1;
      }
    }

    if (index < imageList.length) {
      spreads.push({ type: 'single', images: [imageList[index]], startIndex: index });
    }

    return spreads;
  }, [imageList]);

  const totalSpreads = spreads.length;
  const currentSpreadData = spreads[currentSpread];
  const maxVisibleDots = 7; // Joriy sahifa atrofida 7 ta nuqta ko‘rinadi

  useEffect(() => {
    console.log("MagazineStyleSlider props:", {
      isOpen,
      imagesLength: images?.length || 0,
      loading,
      error,
      images,
    });
  }, [isOpen, images, loading, error]);

  useEffect(() => {
    if (isOpen) {
      setCurrentSpread(0);
      setIsFlipping(false);
      setImageLoaded([]);
      setDragPosition(0);
      setTimeout(() => {
        setPageShaking(true);
        setTimeout(() => setPageShaking(false), 600);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const preloadImages = () => {
      const imagesToPreload = [];
      const currentIndex = currentSpread;
      const nextIndex = currentSpread + 1;
      const prevIndex = currentSpread - 1;

      if (spreads[currentIndex]) imagesToPreload.push(...spreads[currentIndex].images);
      if (spreads[nextIndex]) imagesToPreload.push(...spreads[nextIndex].images);
      if (spreads[prevIndex]) imagesToPreload.push(...spreads[prevIndex].images);

      imagesToPreload.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    };

    if (isOpen && imageList.length > 0) {
      preloadImages();
    }
  }, [currentSpread, isOpen, imageList, spreads]);

  const changeSpread = useCallback(
    async (newSpread: number, direction: 'next' | 'prev') => {
      if (isFlipping || newSpread < 0 || newSpread >= totalSpreads) return;

      setIsFlipping(true);
      setFlipDirection(direction);
      setImageLoaded([]);

      const imagesToLoad = spreads[newSpread].images;
      await Promise.all(
        imagesToLoad.map(
          (src) =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = src;
              img.onload = () => resolve(true);
              img.onerror = () => {
                console.error(`Image load failed: ${src}`);
                resolve(true);
              };
            })
        )
      );

      setTimeout(() => {
        setCurrentSpread(newSpread);
        setDragPosition(
          sliderRef.current ? (newSpread / (totalSpreads - 1)) * (sliderRef.current.offsetWidth - 40) : 0
        );
        setTimeout(() => {
          setIsFlipping(false);
          setPageShaking(true);
          setTimeout(() => setPageShaking(false), 400);
        }, 600);
      }, 300);

      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    },
    [isFlipping, totalSpreads, spreads]
  );

  const nextSpread = useCallback(() => {
    if (currentSpread < totalSpreads - 1) {
      changeSpread(currentSpread + 1, 'next');
    }
  }, [currentSpread, totalSpreads, changeSpread]);

  const prevSpread = useCallback(() => {
    if (currentSpread > 0) {
      changeSpread(currentSpread - 1, 'prev');
    }
  }, [currentSpread, changeSpread]);

  const handleDotClick = useCallback(
    (index: number) => {
      if (index === currentSpread || isFlipping) return;

      const direction = index > currentSpread ? 'next' : 'prev';
      changeSpread(index, direction);
    },
    [currentSpread, isFlipping, changeSpread]
  );

  const handleSliderClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!sliderRef.current || isFlipping) return;

      const sliderWidth = sliderRef.current.offsetWidth - 40;
      const clickPosition = e.clientX - sliderRef.current.getBoundingClientRect().left;
      const newSpread = Math.round((clickPosition / sliderWidth) * (totalSpreads - 1));
      const direction = newSpread > currentSpread ? 'next' : 'prev';
      const snapPosition = (newSpread / (totalSpreads - 1)) * sliderWidth;

      setDragPosition(snapPosition);
      changeSpread(newSpread, direction);
    },
    [currentSpread, totalSpreads, changeSpread, isFlipping]
  );

  const handleDragStart = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (isFlipping) return;
      e.preventDefault();
    },
    [isFlipping]
  );

  const handleDragMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (!sliderRef.current || isFlipping) return;

      const sliderWidth = sliderRef.current.offsetWidth - 40;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const newPosition = Math.max(0, Math.min(clientX - sliderRef.current.getBoundingClientRect().left, sliderWidth));

      // Silliq va barqaror harakat uchun damping qo‘llanadi
      setDragPosition((prev) => prev + (newPosition - prev) * 0.2);

      const newSpread = Math.round((newPosition / sliderWidth) * (totalSpreads - 1));
      if (newSpread !== currentSpread) {
        const direction = newSpread > currentSpread ? 'next' : 'prev';
        changeSpread(newSpread, direction);
      }
    },
    [currentSpread, totalSpreads, changeSpread, isFlipping]
  );

  const handleDragEnd = useCallback(() => {
    if (!sliderRef.current || isFlipping) return;

    const sliderWidth = sliderRef.current.offsetWidth - 40;
    const newSpread = Math.round((dragPosition / sliderWidth) * (totalSpreads - 1));
    const snapPosition = (newSpread / (totalSpreads - 1)) * sliderWidth;

    setDragPosition( snapPosition);

    if (newSpread !== currentSpread) {
      const direction = newSpread > currentSpread ? 'next' : 'prev';
      changeSpread(newSpread, direction);
    }

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [currentSpread, totalSpreads, changeSpread, dragPosition, isFlipping]);

  // Ko‘rinadigan nuqtalar ro‘yxatini hisoblash
  const visibleDots = useMemo(() => {
    const halfDots = Math.floor(maxVisibleDots / 2);
    const start = Math.max(0, currentSpread - halfDots);
    const end = Math.min(totalSpreads, start + maxVisibleDots);
    return Array.from({ length: end - start }, (_, i) => start + i);
  }, [currentSpread, totalSpreads]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-9999" onClose={() => {}} static>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden" onClick={handleBackdropClick}>
          <div className="flex min-h-full items-center justify-center p-1 sm:p-2 md:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-600"
              enterFrom="opacity-0 scale-90 rotate-3"
              enterTo="opacity-100 scale-100 rotate-0"
              leave="ease-in duration-400"
              leaveFrom="opacity-100 scale-100 rotate-0"
              leaveTo="opacity-0 scale-90 rotate-3"
            >
              <Dialog.Panel
                className="w-full h-full max-w-full max-h-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl sm:h-auto transform overflow-hidden transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative mb-1 sm:mb-2 md:mb-4">
                  <div className="bg-gradient-to-r from-slate-800 to-gray-800 rounded-t-none sm:rounded-t-xl px-2 sm:px-4 md:px-6 py-1 sm:py-2 md:py-4 shadow-xl border-b-2 sm:border-b-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                        <div className="text-blue-400 font-bold text-base sm:text-lg md:text-xl">📰 GALEREYA</div>
                        <div className="text-slate-300 text-xs sm:text-sm">MAGAZINE</div>
                      </div>
                      <div className="text-slate-300 font-medium text-xs sm:text-sm md:text-base">
                        {!loading && !error && imageList && (
                          <span className="hidden sm:inline">
                            {currentSpreadData?.type === 'single'
                              ? `Sahifa ${currentSpreadData.startIndex + 1}`
                              : `Sahifalar ${currentSpreadData.startIndex + 1}-${currentSpreadData.startIndex + 2}`}
                            / {imageList.length}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={onClose}
                        className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-slate-700 text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-200 group"
                      >
                        <X size={14} className="sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative bg-white rounded-none sm:rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                  {loading ? (
                    <div className="flex items-center justify-center h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[800px]">
                      <div className="flex flex-col items-center space-y-2 sm:space-y-4">
                        <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-blue-600 animate-spin" />
                        <p className="text-gray-600 font-medium text-sm sm:text-base md:text-lg">Jurnal ochilmoqda...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[800px]">
                      <div className="text-center px-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 border-2 sm:border-4 border-red-200">
                          <X size={20} className="sm:w-8 sm:h-8 md:w-10 md:h-10 text-red-600" />
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">Sahifalar yuklanmadi</h3>
                        <p className="text-gray-600 text-xs sm:text-sm md:text-base">Jurnal sahifalarini ochib bo'lmadi.</p>
                        <p className="text-xs text-gray-500 mt-1 sm:mt-2">Debug: rasmlar soni = {images?.length || 0}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative book-container">
                      {imageList && imageList.length > 0 ? (
                        <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[800px] book-viewer">
                          <div
                            className={`absolute inset-0 flex book-spread ${pageShaking ? 'animate-gentle-shake' : ''}`}
                            style={{ perspective: '2500px', transformStyle: 'preserve-3d' }}
                          >
                            {currentSpreadData?.type === 'single' ? (
                              <div className="w-full h-full relative bg-white shadow-2xl flex items-center justify-center book-page-single">
                                <div className="w-full max-w-2xl sm:max-w-3xl h-full p-2 sm:p-3 md:p-6 lg:p-8 flex flex-col">
                                  <div className="flex-1 flex items-center justify-center overflow-hidden relative">
                                    {!imageLoaded[0] && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                                        <div className="w-full h-full rounded-lg bg-gray-200" />
                                      </div>
                                    )}
                                    <img
                                      src={currentSpreadData.images[0]}
                                      alt={`Sahifa ${currentSpreadData.startIndex + 1}`}
                                      className={`max-w-full max-h-full object-contain rounded-lg shadow-lg transition-opacity duration-300 ${
                                        imageLoaded[0] ? 'opacity-100' : 'opacity-0'
                                      }`}
                                      onLoad={() => setImageLoaded((prev) => ({ ...prev, 0: true }))}
                                      onError={(e) => {
                                        console.log("Single image load error:", currentSpreadData.images[0]);
                                        const target = e.target as HTMLImageElement;
                                        if (fallbackImages[0] && target.src !== fallbackImages[0]) {
                                          target.src = fallbackImages[0];
                                        }
                                        setImageLoaded((prev) => ({ ...prev, 0: true }));
                                      }}
                                    />
                                  </div>
                                  <div className="text-center text-gray-500 text-xs sm:text-sm font-medium mt-1 sm:mt-2 md:mt-4">
                                    {currentSpreadData.startIndex + 1}
                                  </div>
                                </div>
                                <div className="absolute right-4 sm:right-6 md:right-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 rounded-full shadow-inner"></div>
                              </div>
                            ) : (
                              <>
                                <div
                                  className={`w-1/2 h-full relative bg-white border-r border-gray-300 shadow-2xl book-page-left ${
                                    isFlipping && flipDirection === 'prev' ? 'animate-page-flip-prev' : ''
                                  }`}
                                  style={{ transformOrigin: 'right center' }}
                                >
                                  <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-10 md:w-12 lg:w-16 bg-gradient-to-l book-inner-shadow"></div>
                                  <div className="w-full h-full p-1 sm:p-2 md:p-4 lg:p-6 pr-4 sm:pr-6 md:pr-8 lg:pr-10 flex flex-col">
                                    <div className="flex-1 flex items-center justify-center overflow-hidden relative">
                                      {!imageLoaded[0] && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                                          <div className="w-full h-full rounded-lg bg-gray-200" />
                                        </div>
                                      )}
                                      <img
                                        src={currentSpreadData.images[0]}
                                        alt={`Sahifa ${currentSpreadData.startIndex + 1}`}
                                        className={`max-w-full max-h-full object-contain rounded-lg shadow-md transition-opacity duration-300 ${
                                          imageLoaded[0] ? 'opacity-100' : 'opacity-0'
                                        }`}
                                        onLoad={() => setImageLoaded((prev) => ({ ...prev, 0: true }))}
                                        onError={(e) => {
                                          console.log("Left image load error:", currentSpreadData.images[0]);
                                          const target = e.target as HTMLImageElement;
                                          if (fallbackImages[0] && target.src !== fallbackImages[0]) {
                                            target.src = fallbackImages[0];
                                          }
                                          setImageLoaded((prev) => ({ ...prev, 0: true }));
                                        }}
                                      />
                                    </div>
                                    <div className="text-center text-gray-500 text-xs sm:text-sm font-medium mt-1 sm:mt-2">
                                      {currentSpreadData.startIndex + 1}
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={`w-1/2 h-full relative bg-white shadow-2xl book-page-right ${
                                    isFlipping && flipDirection === 'next' ? 'animate-page-flip-next' : ''
                                  }`}
                                  style={{ transformOrigin: 'left center' }}
                                >
                                  <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-10 md:w-12 lg:w-16 bg-gradient-to-r book-inner-shadow"></div>
                                  <div className="w-full h-full p-1 sm:p-2 md:p-4 lg:p-6 pl-4 sm:pl-6 md:pl-8 lg:pl-10 flex flex-col">
                                    <div className="flex-1 flex items-center justify-center overflow-hidden relative">
                                      {!imageLoaded[1] && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                                          <div className="w-full h-full rounded-lg bg-gray-200" />
                                        </div>
                                      )}
                                      <img
                                        src={currentSpreadData.images[1]}
                                        alt={`Sahifa ${currentSpreadData.startIndex + 2}`}
                                        className={`max-w-full max-h-full object-contain rounded-lg shadow-md transition-opacity duration-300 ${
                                          imageLoaded[1] ? 'opacity-100' : 'opacity-0'
                                        }`}
                                        onLoad={() => setImageLoaded((prev) => ({ ...prev, 1: true }))}
                                        onError={(e) => {
                                          console.log("Right image load error:", currentSpreadData.images[1]);
                                          const target = e.target as HTMLImageElement;
                                          if (fallbackImages[1] && target.src !== fallbackImages[1]) {
                                            target.src = fallbackImages[1];
                                          }
                                          setImageLoaded((prev) => ({ ...prev, 1: true }));
                                        }}
                                      />
                                    </div>
                                    <div className="text-center text-gray-500 text-xs sm:text-sm font-medium mt-1 sm:mt-2">
                                      {currentSpreadData.startIndex + 2}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <button
                            onClick={prevSpread}
                            disabled={currentSpread === 0 || isFlipping}
                            className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-slate-800/90 hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
                          >
                            <ChevronLeft size={16} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                          </button>
                          <button
                            onClick={nextSpread}
                            disabled={currentSpread === totalSpreads - 1 || isFlipping}
                            className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-slate-800/90 hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
                          >
                            <ChevronRight size={16} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                          </button>
                          {currentSpreadData?.type === 'double' && (
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 sm:w-1 md:w-2 bg-gradient-to-b from-gray-300 via-gray-500 to-gray-300 transform -translate-x-1/2 z-10 shadow-lg book-spine"></div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[800px]">
                          <div className="text-center px-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 border-2 sm:border-4 border-gray-200">
                              <span className="text-gray-400 text-xl sm:text-2xl md:text-3xl">📰</span>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium">Jurnal bo'sh</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!loading && !error && imageList && totalSpreads > 1 && (
                  <div className="mt-1 sm:mt-2 md:mt-4 bg-gradient-to-r from-slate-800 to-gray-800 rounded-none sm:rounded-xl p-2 sm:p-3 md:p-4 shadow-2xl">
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <div
                        className="relative w-full max-w-[200px] sm:max-w-[350px] md:max-w-[500px] cursor-pointer"
                        ref={sliderRef}
                        onClick={handleSliderClick}
                      >
                        <div className="relative h-1 sm:h-1.5 md:h-2 bg-slate-900/80 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="absolute h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 transition-all duration-500 ease-out"
                            style={{
                              width: `${(currentSpread / (totalSpreads - 1)) * 100}%`,
                            }}
                          />
                          {visibleDots.map((index) => (
                            <div
                              key={index}
                              className="absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 active:scale-110"
                              style={{
                                left: `calc(${(index / (totalSpreads - 1)) * 100}% - ${(totalSpreads > 20 ? 2 : 4)}px)`,
                                width: totalSpreads > 20 ? '2px' : totalSpreads > 10 ? '3px' : '4px',
                                height: totalSpreads > 20 ? '2px' : totalSpreads > 10 ? '3px' : '4px',
                                backgroundColor: index === currentSpread ? '#ffffff' : '#94a3b8',
                                opacity: index === currentSpread ? 1 : 0.7,
                                boxShadow: index === currentSpread ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none',
                              }}
                              onClick={() => handleDotClick(index)}
                            />
                          ))}
                        </div>
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-10 h-10 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full shadow-lg border-2 border-slate-900/50 cursor-grab hover:scale-110 active:scale-100 transition-all duration-300 flex items-center justify-center"
                          style={{
                            left: `calc(${(currentSpread / (totalSpreads - 1)) * 100}% - 20px)`,
                          }}
                          onMouseDown={handleDragStart}
                          onMouseMove={handleDragMove}
                          onMouseUp={handleDragEnd}
                          onTouchStart={handleDragStart}
                          onTouchMove={handleDragMove}
                          onTouchEnd={handleDragEnd}
                        >
                          <span className="text-xs sm:text-sm font-bold text-white drop-shadow">
                            
                          </span>
                        </div>
                      </div>
                      <div className="text-slate-200 text-xs sm:text-sm font-medium flex-shrink-0">
                        {imageList.length} sahifa
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        <style>{`
          .book-container { transform-style: preserve-3d; }
          .book-viewer {
            background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 8px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.2);
          }
          .book-spread { transform-style: preserve-3d; transition: transform 0.3s ease-out; }
          .book-page-single {
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.7);
            background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
          }
          .book-page-left {
            border-radius: 8px 0 0 8px;
            box-shadow: -2px 0 8px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.7);
            background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
          }
          .book-page-right {
            border-radius: 0 8px 8px 0;
            box-shadow: 2px 0 8px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.7);
            background: linear-gradient(225deg, #ffffff 0%, #f8f8f8 100%);
          }
          .book-inner-shadow {
            background: linear-gradient(to left, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 30%, transparent 100%);
            opacity: 0.6;
            transition: opacity 0.5s ease;
          }
          .book-spine {
            background: linear-gradient(180deg, rgba(75, 85, 99, 0.3) 0%, rgba(75, 85, 99, 0.5) 50%, rgba(75, 85, 99, 0.3) 100%);
            border-radius: 2px;
            box-shadow: 0 0 6px rgba(0,0,0,0.25);
          }
          @keyframes gentle-shake {
            0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
            10% { transform: translateX(-0.5px) translateY(-0.3px) rotate(-0.05deg); }
            20% { transform: translateX(0.5px) translateY(0.3px) rotate(0.05deg); }
            30% { transform: translateX(-0.3px) translateY(-0.2px) rotate(-0.03deg); }
            40% { transform: translateX(0.3px) translateY(0.2px) rotate(0.03deg); }
            50% { transform: translateX(-0.2px) translateY(-0.1px) rotate(-0.02deg); }
            60% { transform: translateX(0.2px) translateY(0.1px) rotate(0.02deg); }
            70% { transform: translateX(-0.1px) translateY(-0.05px) rotate(-0.01deg); }
            80% { transform: translateX(0.1px) translateY(0.05px) rotate(0.01deg); }
            90% { transform: translateX(0) translateY(0) rotate(0deg); }
          }
          .animate-gentle-shake { animation: gentle-shake 0.6s ease-in-out; }
          @keyframes page-flip-next {
            0% { transform: perspective(2000px) rotateY(0deg) translateZ(0px); opacity: 1; filter: brightness(1) drop-shadow(0 0 4px rgba(0,0,0,0.2)); }
            10% { transform: perspective(2000px) rotateY(-6deg) translateZ(6px) skewY(0.5deg); opacity: 0.99; filter: brightness(0.98) drop-shadow(-2px 4px 6px rgba(0,0,0,0.25)); }
            25% { transform: perspective(2000px) rotateY(-20deg) translateZ(15px) skewY(-0.5deg); opacity: 0.97; filter: brightness(0.95) drop-shadow(-4px 6px 8px rgba(0,0,0,0.3)); }
            40% { transform: perspective(2000px) rotateY(-50deg) translateZ(25px) skewY(0.3deg); opacity: 0.94; filter: brightness(0.9) drop-shadow(-6px 8px 10px rgba(0,0,0,0.35)); }
            60% { transform: perspective(2000px) rotateY(-110deg) translateZ(25px) skewY(-0.3deg); opacity: 0.88; filter: brightness(0.85) drop-shadow(-4px 6px 8px rgba(0,0,0,0.35)); }
            75% { transform: perspective(2000px) rotateY(-150deg) translateZ(15px) skewY(0deg); opacity: 0.92; filter: brightness(0.9) drop-shadow(-2px 4px 6px rgba(0,0,0,0.3)); }
            90% { transform: perspective(2000px) rotateY(-170deg) translateZ(6px) skewY(0deg); opacity: 0.95; filter: brightness(0.95) drop-shadow(0 2px 4px rgba(0,0,0,0.25)); }
            100% { transform: perspective(2000px) rotateY(-180deg) translateZ(0px); opacity: 0; filter: brightness(1) drop-shadow(0 0 0 rgba(0,0,0,0)); }
          }
          @keyframes page-flip-prev {
            0% { transform: perspective(2000px) rotateY(0deg) translateZ(0px); opacity: 1; filter: brightness(1) drop-shadow(0 0 4px rgba(0,0,0,0.2)); }
            10% { transform: perspective(2000px) rotateY(6deg) translateZ(6px) skewY(-0.5deg); opacity: 0.99; filter: brightness(0.98) drop-shadow(2px 4px 6px rgba(0,0,0,0.25)); }
            25% { transform: perspective(2000px) rotateY(20deg) translateZ(15px) skewY(0.5deg); opacity: 0.97; filter: brightness(0.95) drop-shadow(4px 6px 8px rgba(0,0,0,0.3)); }
            40% { transform: perspective(2000px) rotateY(50deg) translateZ(25px) skewY(-0.3deg); opacity: 0.94; filter: brightness(0.9) drop-shadow(6px 8px 10px rgba(0,0,0,0.35)); }
            60% { transform: perspective(2000px) rotateY(110deg) translateZ(25px) skewY(0.3deg); opacity: 0.88; filter: brightness(0.85) drop-shadow(4px 6px 8px rgba(0,0,0,0.35)); }
            75% { transform: perspective(2000px) rotateY(150deg) translateZ(15px) skewY(0deg); opacity: 0.92; filter: brightness(0.9) drop-shadow(2px 4px 6px rgba(0,0,0,0.3)); }
            90% { transform: perspective(2000px) rotateY(170deg) translateZ(6px) skewY(0deg); opacity: 0.95; filter: brightness(0.95) drop-shadow(0 2px 4px rgba(0,0,0,0.25)); }
            100% { transform: perspective(2000px) rotateY(180deg) translateZ(0px); opacity: 0; filter: brightness(1) drop-shadow(0 0 0 rgba(0,0,0,0)); }
          }
          .animate-page-flip-next { animation: page-flip-next 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards; z-index: 10; }
          .animate-page-flip-prev { animation: page-flip-prev 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards; z-index: 10; }
          @media (max-width: 640px) {
            .book-viewer { box-shadow: inset 0 1px 2px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.15); }
            .book-page-left, .book-page-right {
              box-shadow: 0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.7);
            }
            .book-inner-shadow { opacity: 0.5; width: 6px; }
            .book-spine { width: 1px; }
            .animate-page-flip-next, .animate-page-flip-prev { animation-duration: 0.5s; }
          }
          @media (max-width: 768px) {
            .book-page-left, .book-page-right {
              box-shadow: 0 3px 10px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.7);
            }
            .book-inner-shadow { opacity: 0.6; }
            .animate-page-flip-next, .animate-page-flip-prev { animation-duration: 0.6s; }
          }
          @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .book-viewer { box-shadow: inset 0 1px 2px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.15); }
          }
        `}</style>
      </Dialog>
    </Transition>
  );
};

export default MagazineStyleSlider;
