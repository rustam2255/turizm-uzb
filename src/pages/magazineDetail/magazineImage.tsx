import { Dialog, Transition } from "@headlessui/react";
import { X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Fragment, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image1 from "@assets/images/place1.png";
import Image2 from "@assets/images/place3.png";
import PaperRustleSound from "@assets/sounds/paper-rustle.mp3";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  loading: boolean;
  error: boolean;
}

class ImageCache {
  private static instance: ImageCache;
  private cache = new Map<string, HTMLImageElement>();
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>();

  static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  async preloadImage(src: string): Promise<HTMLImageElement> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.onload = () => {
        this.cache.set(src, img);
        this.loadingPromises.delete(src);
        resolve(img);
      };
      img.onerror = () => {
        this.loadingPromises.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });

    this.loadingPromises.set(src, loadPromise);
    return loadPromise;
  }

  getFromCache(src: string): HTMLImageElement | null {
    return this.cache.get(src) || null;
  }

  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }
}

const MagazineStyleSlider = ({ isOpen, onClose, images, loading, error }: Props) => {
  const imageCache = ImageCache.getInstance();
  const fallbackImages = [Image1, Image2];
  const imageList = images && images.length > 0 ? images : fallbackImages;

  const [currentSpread, setCurrentSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [pageShaking, setPageShaking] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
  const [preloadedSpreads, setPreloadedSpreads] = useState<Set<number>>(new Set());
  const [dragPosition, setDragPosition] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const spreads = useMemo(() => {
    if (imageList.length <= 1) {
      return [{ type: "single" as const, images: imageList, startIndex: 0 }];
    }

    const spreads: Array<{ type: "single" | "double"; images: string[]; startIndex: number }> = [];
    spreads.push({ type: "single", images: [imageList[0]], startIndex: 0 });

    let index = 1;
    while (index < imageList.length - 1) {
      if (index + 1 < imageList.length - 1) {
        spreads.push({
          type: "double",
          images: [imageList[index], imageList[index + 1]],
          startIndex: index,
        });
        index += 2;
      } else {
        spreads.push({ type: "single", images: [imageList[index]], startIndex: index });
        index += 1;
      }
    }

    if (index < imageList.length) {
      spreads.push({ type: "single", images: [imageList[index]], startIndex: index });
    }

    return spreads;
  }, [imageList]);

  const totalSpreads = spreads.length;
  const currentSpreadData = spreads[currentSpread];
  const maxVisibleDots = 7;

  const preloadImagesForSpread = useCallback(
    async (spreadIndex: number) => {
      if (preloadedSpreads.has(spreadIndex) || !spreads[spreadIndex]) return;

      try {
        const spreadData = spreads[spreadIndex];
        const loadPromises = spreadData.images.map((src) =>
          imageCache.preloadImage(src).catch((err) => {
            console.warn(`Failed to preload image: ${src}`, err);
            return null;
          })
        );

        await Promise.allSettled(loadPromises);
        setPreloadedSpreads((prev) => new Set([...prev, spreadIndex]));

        setImageLoaded((prev) => {
          const newState = { ...prev };
          spreadData.images.forEach((_, idx) => {
            newState[spreadData.startIndex + idx] = true;
          });
          return newState;
        });
      } catch (error) {
        console.warn(`Failed to preload spread ${spreadIndex}:`, error);
      }
    },
    [spreads, imageCache, preloadedSpreads]
  );

  const preloadStrategy = useCallback(async () => {
    const spreadIndicesToPreload = [
      currentSpread - 1,
      currentSpread,
      currentSpread + 1,
      currentSpread + 2,
    ].filter((index) => index >= 0 && index < totalSpreads);

    const priorityOrder = [currentSpread, currentSpread + 1, currentSpread - 1, currentSpread + 2]
      .filter((index) => index >= 0 && index < totalSpreads);

    for (const index of priorityOrder) {
      await preloadImagesForSpread(index);
    }
  }, [currentSpread, totalSpreads, preloadImagesForSpread]);

  useEffect(() => {
    if (isOpen && imageList.length > 0) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      preloadStrategy();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isOpen, imageList, preloadStrategy]);

  useEffect(() => {
    if (isOpen) {
      preloadStrategy();
    }
  }, [currentSpread, isOpen, preloadStrategy]);

  useEffect(() => {
    if (isOpen) {
      setCurrentSpread(0);
      setIsFlipping(false);
      setImageLoaded({});
      setPreloadedSpreads(new Set());
      setDragPosition(0);

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => console.warn("Audio play failed:", err));
      }
      setTimeout(() => {
        setPageShaking(true);
        setTimeout(() => setPageShaking(false), 600);
      }, 100);
    }
  }, [isOpen]);

  const changeSpread = useCallback(
    async (newSpread: number, direction: "next" | "prev") => {
      if (isFlipping || newSpread < 0 || newSpread >= totalSpreads) return;

      setIsFlipping(true);
      setFlipDirection(direction);

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => console.warn("Audio play failed:", err));
      }

      const updateSpread = () => {
        setCurrentSpread(newSpread);
        setDragPosition(
          sliderRef.current ? (newSpread / (totalSpreads - 1)) * (sliderRef.current.offsetWidth - 40) : 0
        );
      };

      const targetSpread = spreads[newSpread];
      const allImagesPreloaded = targetSpread.images.every((src) => imageCache.getFromCache(src));

      if (allImagesPreloaded) {
        updateSpread();
        setTimeout(() => {
          setIsFlipping(false);
          setPageShaking(true);
          setTimeout(() => setPageShaking(false), 300);
        }, 600);
      } else {
        await preloadImagesForSpread(newSpread);
        setTimeout(() => {
          updateSpread();
          setTimeout(() => {
            setIsFlipping(false);
            setPageShaking(true);
            setTimeout(() => setPageShaking(false), 300);
          }, 600);
        }, 100);
      }

      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    },
    [isFlipping, totalSpreads, spreads, imageCache, preloadImagesForSpread]
  );

  const nextSpread = useCallback(() => {
    if (currentSpread < totalSpreads - 1) {
      changeSpread(currentSpread + 1, "next");
    }
  }, [currentSpread, totalSpreads, changeSpread]);

  const prevSpread = useCallback(() => {
    if (currentSpread > 0) {
      changeSpread(currentSpread - 1, "prev");
    }
  }, [currentSpread, changeSpread]);

  const handleDotClick = useCallback(
    (index: number) => {
      if (index === currentSpread || isFlipping) return;
      const direction = index > currentSpread ? "next" : "prev";
      changeSpread(index, direction);
    },
    [currentSpread, isFlipping, changeSpread]
  );

  const handleSliderClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!sliderRef.current || isFlipping) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const sliderWidth = rect.width - 40;
      const clickPosition = e.clientX - rect.left;
      const newSpread = Math.round((clickPosition / sliderWidth) * (totalSpreads - 1));

      if (newSpread !== currentSpread) {
        const direction = newSpread > currentSpread ? "next" : "prev";
        changeSpread(newSpread, direction);
      }
    },
    [currentSpread, totalSpreads, changeSpread, isFlipping]
  );

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isFlipping) return;
    e.preventDefault();
  }, [isFlipping]);

  const handleDragMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!sliderRef.current || isFlipping) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const sliderWidth = rect.width - 40;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const newPosition = Math.max(0, Math.min(clientX - rect.left, sliderWidth));

      setDragPosition(newPosition);

      const newSpread = Math.round((newPosition / sliderWidth) * (totalSpreads - 1));
      if (newSpread !== currentSpread) {
        const direction = newSpread > currentSpread ? "next" : "prev";
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

    setDragPosition(snapPosition);

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, [dragPosition, totalSpreads, isFlipping]);

  const visibleDots = useMemo(() => {
    const halfDots = Math.floor(maxVisibleDots / 2);
    const start = Math.max(0, currentSpread - halfDots);
    const end = Math.min(totalSpreads, start + maxVisibleDots);
    return Array.from({ length: end - start }, (_, i) => start + i);
  }, [currentSpread, totalSpreads]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const OptimizedImage = useCallback(
    ({
      src,
      alt,
      index,
      onLoad,
      onError,
    }: {
      src: string;
      alt: string;
      index: number;
      onLoad: () => void;
      onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    }) => {
      const cachedImage = imageCache.getFromCache(src);

      return (
        <>
          {!imageLoaded[index] && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-full h-full rounded-lg bg-gray-200 animate-pulse" />
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={`max-w-full max-h-full object-contain rounded-lg shadow-lg transition-opacity duration-200 ${
              imageLoaded[index] || cachedImage ? "opacity-100" : "opacity-0"
            }`}
            onLoad={onLoad}
            onError={onError}
            decoding="async"
            loading="eager"
            style={{
              transform: "translateZ(0)",
              willChange: "opacity",
            }}
          />
        </>
      );
    },
    [imageCache, imageLoaded]
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const pageVariants = {
    initial: (direction: "next" | "prev") => ({
      rotateY: direction === "next" ? 0 : 0,
      opacity: 1,
      translateZ: 0,
      boxShadow: direction === "next" ? "2px 0 8px rgba(0,0,0,0.15)" : "-2px 0 8px rgba(0,0,0,0.15)",
      filter: "brightness(1)",
    }),
    animate: {
      rotateY: 0,
      opacity: 1,
      translateZ: 0,
      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      filter: "brightness(1)",
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
    exit: (direction: "next" | "prev") => ({
      rotateY: direction === "next" ? -180 : 180,
      opacity: 0,
      translateZ: 20,
      boxShadow: direction === "next" ? "12px 0 16px rgba(0,0,0,0.4)" : "-12px 0 16px rgba(0,0,0,0.4)",
      filter: "brightness(0.85)",
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    }),
  };

  const coverVariants = {
    initial: { rotateY: 90, opacity: 0, translateZ: 20, boxShadow: "0 6px 20px rgba(0,0,0,0.25)" },
    animate: {
      rotateY: 0,
      opacity: 1,
      translateZ: 0,
      boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-9999" onClose={() => {}} static>
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
            className="fixed inset-0 backdrop-blur-sm"
            style={{ backgroundImage: "url('/images/wow.webp')" }}
            onClick={handleBackdropClick}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden flex flex-col" onClick={handleBackdropClick}>
          <div className="flex min-h-0 flex-1 items-center justify-center p-1 sm:p-2 md:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-400"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-full h-full max-h-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl flex flex-col transform overflow-hidden transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <audio ref={audioRef} src={PaperRustleSound} preload="auto" />
                <div className="relative mb-1 sm:mb-2 md:mb-3">
                  <div className="bg-gradient-to-r from-slate-800 to-gray-800 rounded-t-none sm:rounded-t-xl px-2 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 shadow-xl border-b-2 sm:border-b-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                        <div className="text-blue-400 font-bold text-base sm:text-lg md:text-xl">📰 GALEREYA</div>
                        <div className="text-slate-300 text-xs sm:text-sm">MAGAZINE</div>
                      </div>
                      <div className="text-slate-300 font-medium text-xs sm:text-sm md:text-base">
                        {!loading && !error && imageList && (
                          <span className="hidden sm:inline">
                            {currentSpreadData?.type === "single"
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
                        <X
                          size={14}
                          className="sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-200"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col bg-white rounded-none sm:rounded-xl shadow-2xl border border-gray-200 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center flex-1 min-h-0">
                      <div className="flex flex-col items-center space-y-2 sm:space-y-4">
                        <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-blue-600 animate-spin" />
                        <p className="text-gray-600 font-medium text-sm sm:text-base md:text-lg">Jurnal ochilmoqda...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center flex-1 min-h-0">
                      <div className="text-center px-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 border-2 sm:border-4 border-red-200">
                          <X size={20} className="sm:w-8 sm:h-8 md:w-10 md:h-10 text-red-600" />
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">Sahifalar yuklanmadi</h3>
                        <p className="text-gray-600 text-xs sm:text-sm md:text-base">Jurnal sahifalarini ochib bo'lmadi.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col book-container">
                      {imageList && imageList.length > 0 ? (
                        <div className="flex-1 h-full max-h-[calc(100vh-120px)] book-viewer">
                          <AnimatePresence initial={false} custom={flipDirection}>
                            <motion.div
                              key={currentSpread}
                              className={`absolute inset-0 flex book-spread ${pageShaking ? "animate-gentle-shake" : ""}`}
                              style={{
                                perspective: "2500px",
                                transformStyle: "preserve-3d",
                                willChange: "transform",
                              }}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              variants={pageVariants}
                              custom={flipDirection}
                            >
                              {currentSpreadData?.type === "single" ? (
                                <motion.div
                                  className={`w-full h-full relative bg-white shadow-2xl flex items-center justify-center book-page-single ${
                                    currentSpread === 0 || currentSpread === totalSpreads - 1 ? "book-page-cover" : ""
                                  }`}
                                  style={{
                                    transformOrigin: currentSpread === 0 ? "right center" : "left center",
                                    willChange: "transform, opacity, filter, box-shadow",
                                  }}
                                  variants={currentSpread === 0 ? coverVariants : pageVariants}
                                >
                                  <div className="w-full max-w-2xl sm:max-w-3xl h-full p-2 sm:p-3 md:p-6 lg:p-8 flex flex-col">
                                    <div className="flex-1 flex items-center justify-center overflow-hidden relative">
                                      <OptimizedImage
                                        src={currentSpreadData.images[0]}
                                        alt={`Sahifa ${currentSpreadData.startIndex + 1}`}
                                        index={currentSpreadData.startIndex}
                                        onLoad={() =>
                                          setImageLoaded((prev) => ({
                                            ...prev,
                                            [currentSpreadData.startIndex]: true,
                                          }))
                                        }
                                        onError={(e) => {
                                          console.warn("Single image load error:", currentSpreadData.images[0]);
                                          const target = e.target as HTMLImageElement;
                                          if (fallbackImages[0] && target.src !== fallbackImages[0]) {
                                            target.src = fallbackImages[0];
                                          }
                                          setImageLoaded((prev) => ({
                                            ...prev,
                                            [currentSpreadData.startIndex]: true,
                                          }));
                                        }}
                                      />
                                    </div>
                                    <div className="text-center text-gray-500 text-xs sm:text-sm font-medium mt-1 sm:mt-2 md:mt-4">
                                      {currentSpreadData.startIndex + 1}
                                    </div>
                                  </div>
                                  <div className="absolute right-4 sm:right-6 md:right-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 rounded-full shadow-inner"></div>
                                </motion.div>
                              ) : (
                                <>
                                  <motion.div
                                    className={`w-1/2 h-full relative bg-white border-r border-gray-300 shadow-2xl book-page-left`}
                                    style={{
                                      transformOrigin: "right center",
                                      willChange: "transform, opacity, filter, box-shadow",
                                    }}
                                    variants={flipDirection === "prev" ? pageVariants : undefined}
                                    custom={flipDirection}
                                  >
                                    <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-10 md:w-12 lg:w-16 bg-gradient-to-l book-inner-shadow"></div>
                                    <div className="w-full h-full p-1 sm:p-2 md:p-4 lg:p-6 pr-4 sm:pr-6 md:pr-8 lg:pr-10 flex flex-col">
                                      <div className="flex-1 flex items-center justify-center overflow-hidden relative">
                                        <OptimizedImage
                                          src={currentSpreadData.images[0]}
                                          alt={`Sahifa ${currentSpreadData.startIndex + 1}`}
                                          index={currentSpreadData.startIndex}
                                          onLoad={() =>
                                            setImageLoaded((prev) => ({
                                              ...prev,
                                              [currentSpreadData.startIndex]: true,
                                            }))
                                          }
                                          onError={(e) => {
                                            console.warn("Left image load error:", currentSpreadData.images[0]);
                                            const target = e.target as HTMLImageElement;
                                            if (fallbackImages[0] && target.src !== fallbackImages[0]) {
                                              target.src = fallbackImages[0];
                                            }
                                            setImageLoaded((prev) => ({
                                              ...prev,
                                              [currentSpreadData.startIndex]: true,
                                            }));
                                          }}
                                        />
                                      </div>
                                      <div className="text-center text-gray-500 text-xs sm:text-sm font-medium mt-1 sm:mt-2">
                                        {currentSpreadData.startIndex + 1}
                                      </div>
                                    </div>
                                  </motion.div>
                                  <motion.div
                                    className={`w-1/2 h-full relative bg-white shadow-2xl book-page-right`}
                                    style={{
                                      transformOrigin: "left center",
                                      willChange: "transform, opacity, filter, box-shadow",
                                    }}
                                    variants={flipDirection === "next" ? pageVariants : undefined}
                                    custom={flipDirection}
                                  >
                                    <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-10 md:w-12 lg:w-16 bg-gradient-to-r book-inner-shadow"></div>
                                    <div className="w-full h-full p-1 sm:p-2 md:p-4 lg:p-6 pl-4 sm:pl-6 md:pl-8 lg:pl-10 flex flex-col">
                                      <div className="flex-1 flex items-center justify-center overflow-hidden relative">
                                        <OptimizedImage
                                          src={currentSpreadData.images[1]}
                                          alt={`Sahifa ${currentSpreadData.startIndex + 2}`}
                                          index={currentSpreadData.startIndex + 1}
                                          onLoad={() =>
                                            setImageLoaded((prev) => ({
                                              ...prev,
                                              [currentSpreadData.startIndex + 1]: true,
                                            }))
                                          }
                                          onError={(e) => {
                                            console.warn("Right image load error:", currentSpreadData.images[1]);
                                            const target = e.target as HTMLImageElement;
                                            if (fallbackImages[1] && target.src !== fallbackImages[1]) {
                                              target.src = fallbackImages[1];
                                            }
                                            setImageLoaded((prev) => ({
                                              ...prev,
                                              [currentSpreadData.startIndex + 1]: true,
                                            }));
                                          }}
                                        />
                                      </div>
                                      <div className="text-center text-gray-500 text-xs sm:text-sm font-medium mt-1 sm:mt-2">
                                        {currentSpreadData.startIndex + 2}
                                      </div>
                                    </div>
                                  </motion.div>
                                </>
                              )}
                            </motion.div>
                          </AnimatePresence>

                          <button
                            onClick={prevSpread}
                            disabled={currentSpread === 0 || isFlipping}
                            className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-slate-800/90 hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm touch-manipulation"
                          >
                            <ChevronLeft size={16} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                          </button>

                          <button
                            onClick={nextSpread}
                            disabled={currentSpread === totalSpreads - 1 || isFlipping}
                            className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-slate-800/90 hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm touch-manipulation"
                          >
                            <ChevronRight size={16} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                          </button>

                          {currentSpreadData?.type === "double" && (
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 sm:w-1 md:w-2 bg-gradient-to-b from-gray-300 via-gray-500 to-gray-300 transform -translate-x-1/2 z-10 shadow-lg book-spine"></div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center flex-1 min-h-0">
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
                  <div className="bg-gradient-to-r from-slate-800 to-gray-800 rounded-none sm:rounded-xl p-2 sm:p-3 md:p-4 shadow-2xl">
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <div
                        className="relative w-full max-w-[200px] sm:max-w-[350px] md:max-w-[500px] cursor-pointer touch-manipulation"
                        ref={sliderRef}
                        onClick={handleSliderClick}
                      >
                        <div className="relative h-1 sm:h-1.5 md:h-2 bg-slate-900/80 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="absolute h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 transition-all duration-300 ease-out will-change-transform"
                            style={{
                              width: `${(currentSpread / (totalSpreads - 1)) * 100}%`,
                              transform: "translateZ(0)",
                            }}
                          />
                          {visibleDots.map((index) => (
                            <div
                              key={index}
                              className="absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-200 cursor-pointer hover:scale-125 active:scale-110 touch-manipulation"
                              style={{
                                left: `calc(${(index / (totalSpreads - 1)) * 100}% - ${totalSpreads > 20 ? 2 : 4}px)`,
                                width: totalSpreads > 20 ? "2px" : totalSpreads > 10 ? "3px" : "4px",
                                height: totalSpreads > 20 ? "2px" : totalSpreads > 10 ? "3px" : "4px",
                                backgroundColor: index === currentSpread ? "#ffffff" : "#94a3b8",
                                opacity: index === currentSpread ? 1 : 0.7,
                                boxShadow: index === currentSpread ? "0 0 8px rgba(59, 130, 246, 0.5)" : "none",
                                transform: "translateZ(0)",
                                willChange: "transform, opacity",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDotClick(index);
                              }}
                            />
                          ))}
                        </div>
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full shadow-lg border-2 border-slate-900/50 cursor-grab hover:scale-110 active:scale-100 transition-all duration-200 flex items-center justify-center touch-manipulation"
                          style={{
                            left: `calc(${(currentSpread / (totalSpreads - 1)) * 100}% - ${16}px)`,
                            transform: "translateZ(0)",
                            willChange: "transform",
                          }}
                          onMouseDown={handleDragStart}
                          onMouseMove={handleDragMove}
                          onMouseUp={handleDragEnd}
                          onTouchStart={handleDragStart}
                          onTouchMove={handleDragMove}
                          onTouchEnd={handleDragEnd}
                        >
                          <div className="w-1 h-1 bg-white rounded-full opacity-80" />
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
          .book-container {
            transform-style: preserve-3d;
            contain: layout style paint;
          }
          .book-viewer {
            background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 8px;
            background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4"%3E%3Cpath fill="%23e9ecef" fill-opacity="0.1" d="M1 3h1v1H1V3zm2-2h1v1H3V1z"/%3E%3C/svg%3E');
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.2);
            contain: layout style paint;
          }
          .book-spread {
            transform-style: preserve-3d;
            contain: layout style paint;
          }
          .book-page-single {
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.7);
            background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
            contain: layout style paint;
          }
          .book-page-cover {
            background: linear-gradient(135deg, #f9f9f9 0%, #e0e0e0 100%);
            border: 2px solid #d1d5db;
            box-shadow: 0 6px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.7);
          }
          .book-page-left {
            border-radius: 8px 0 0 8px;
            box-shadow: -2px 0 8px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.7);
            background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
            contain: layout style paint;
          }
          .book-page-right {
            border-radius: 0 8px 8px 0;
            box-shadow: 2px 0 8px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.7);
            background: linear-gradient(225deg, #ffffff 0%, #f5f5f5 100%);
            contain: layout style paint;
          }
          .book-inner-shadow {
            background: linear-gradient(to left, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.08) 30%, transparent 100%);
            opacity: 0.7;
            transition: opacity 0.3s ease;
            willChange: opacity;
          }
          .book-spine {
            background: linear-gradient(180deg, rgba(75, 85, 99, 0.3) 0%, rgba(75, 85, 99, 0.5) 50%, rgba(75, 85, 99, 0.3) 100%);
            border-radius: 2px;
            box-shadow: 0 0 6px rgba(0,0,0,0.25);
          }

          @keyframes gentle-shake {
            0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
            25% { transform: translateX(-0.5px) translateY(-0.3px) rotate(-0.05deg); }
            50% { transform: translateX(0.5px) translateY(0.3px) rotate(0.05deg); }
            75% { transform: translateX(-0.3px) translateY(-0.2px) rotate(-0.03deg); }
          }
          .animate-gentle-shake {
            animation: gentle-shake 0.4s ease-in-out;
            will-change: transform;
          }

          @media (max-width: 640px) {
            .book-viewer {
              box-shadow: inset 0 1px 2px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.15);
              contain: strict;
            }
            .book-page-left, .book-page-right, .book-page-single, .book-page-cover {
              box-shadow: 0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.7);
              contain: strict;
            }
            .book-inner-shadow {
              opacity: 0.4;
              width: 6px;
            }
            .book-spine {
              width: 1px;
            }
          }

          @media (max-width: 768px) {
            .book-page-left, .book-page-right, .book-page-single, .book-page-cover {
              box-shadow: 0 3px 10px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.7);
            }
            .book-inner-shadow {
              opacity: 0.5;
            }
          }

          .book-spread, .book-page-left, .book-page-right, .book-page-single, .book-page-cover {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            transform-style: preserve-3d;
            -webkit-transform-style: preserve-3d;
          }

          .touch-manipulation {
            touch-action: manipulation;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
          }

          @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .book-viewer {
              box-shadow: inset 0 1px 2px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.15);
            }
          }

          img[loading="eager"] {
            content-visibility: auto;
          }

          .book-container * {
            transform-style: preserve-3d;
            backface-visibility: hidden;
          }
        `}</style>
      </Dialog>
    </Transition>
  );
};

export default MagazineStyleSlider;