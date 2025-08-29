import React, { useEffect, useRef, useState, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import PaperRustleSound from "@assets/sounds/paper-rustle.mp3";

// Rasmlarni oldindan yuklash funksiyasi
const preloadImages = (imageUrls: string[]) => {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

interface MagazineFlipViewerProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  loading: boolean;
  error: boolean;
}

const MagazineFlipViewer: React.FC<MagazineFlipViewerProps> = ({
  isOpen,
  onClose,
  images,
  loading,
  error,
}) => {
  const { t } = useTranslation();
  const bookRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [page, setPage] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Ovoz ob'ektini yaratish
  useEffect(() => {
    if (isOpen) {
      audioRef.current = new Audio(PaperRustleSound);
      audioRef.current.preload = "auto";
    }
    return () => {
      audioRef.current = null; // Tozalash
    };
  }, [isOpen]);

  // Barcha rasmlarni oldindan yuklash
  useEffect(() => {
    if (isOpen && images.length > 0) {
      preloadImages(images); // Barcha rasmlarni birinchi ochilishda yuklash
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 500); // 500ms kechikish, rasmlar keshlanishi uchun
      return () => clearTimeout(timer);
    }
  }, [isOpen, images]);

  // Sahifa o‘zgarishi
  const onFlip = useCallback(
    (e: any) => {
      setPage(e.data);
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // Ovozni boshidan boshlash
        audioRef.current.play().catch((err) => console.error("Ovoz ijro xatosi:", err));
      }
    },
    []
  );

  // Oldinga va orqaga navigatsiya
  const goNext = useCallback(() => {
    if (bookRef.current && page < images.length - 1) {
      bookRef.current.pageFlip().flipNext();
    }
  }, [page, images.length]);

  const goPrev = useCallback(() => {
    if (bookRef.current && page > 0) {
      bookRef.current.pageFlip().flipPrev();
    }
  }, [page]);

  // Slider orqali sahifaga o‘tish
  const goToPage = useCallback(
    (pageIndex: number) => {
      if (bookRef.current && pageIndex >= 0 && pageIndex < images.length) {
        bookRef.current.pageFlip().flip(pageIndex);
      }
    },
    [images.length]
  );

  // Slider o‘zgarishi
  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPage = parseInt(e.target.value);
      setPage(newPage);
      goToPage(newPage);
    },
    [goToPage]
  );

  // Klaviatura boshqaruvi
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, goNext, goPrev, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 mt-20 bg-black/90 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Yopish tugmasi */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-gray-800/60 rounded-full p-2 backdrop-blur-md transition-all duration-200 z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={28} />
          </motion.button>

          <motion.div
            className="relative w-full max-w-5xl h-[85vh] bg-white rounded-xl shadow-xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {(loading || isInitialLoading) ? (
              <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-blue-100">
                <motion.div
                  className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-blue-600 text-base mt-3">
                  {t("loading", "Yuklanmoqda...")}
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-50 to-red-100">
                <motion.div
                  className="text-4xl text-red-500 mb-3"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  ⚠️
                </motion.div>
                <p className="text-red-600 font-medium text-base">
                  {t("error", "Xatolik yuz berdi")}
                </p>
              </div>
            ) : (
              <>
                {/* Oldingi tugma */}
                <motion.button
                  onClick={goPrev}
                  disabled={page === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-800/60 hover:bg-gray-800/80 text-white rounded-full p-2.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft size={24} />
                </motion.button>

                {/* Kitob */}
                <HTMLFlipBook
                  {...({
                    width: 500,
                    height: 700,
                    size: "stretch",
                    minWidth: 300,
                    maxWidth: 800,
                    minHeight: 400,
                    maxHeight: 1200,
                    drawShadow: true,
                    flippingTime: 500,
                    useMouseEvents: true,
                    showCover: true,
                    mobileScrollSupport: true,
                    ref: bookRef,
                    onFlip,
                    className: "mx-auto",
                  } as any)}
                >
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center bg-white shadow-inner border border-gray-100"
                    >
                      <img
                        src={img}
                        alt={'Photo'}
                        className="w-full h-full object-contain rounded-md"
                        loading={index <= 2 ? "eager" : "lazy"}
                        onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/500x700/e2e8f0/64748b?text=Rasm+topilmadi")
                        }
                      />
                    </div>
                  ))}
                </HTMLFlipBook>

                {/* Keyingi tugma */}
                <motion.button
                  onClick={goNext}
                  disabled={page >= images.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-800/60 hover:bg-gray-800/80 text-white rounded-full p-2.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight size={24} />
                </motion.button>

                {/* Sahifa ko‘rsatkichi va slider */}
                {images.length > 0 && (
                  <motion.div
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-gray-800/70 text-white px-4 py-2 rounded-full flex items-center space-x-3"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-sm font-medium">
                      {page + 1} / {images.length}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={images.length - 1}
                      value={page}
                      onChange={handleSliderChange}
                      className="w-32 h-2 bg-gray-700/50 rounded-lg cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(page / (images.length - 1)) * 100
                          }%, #ffffff33 ${(page / (images.length - 1)) * 100}%, #ffffff33 100%)`,
                      }}
                    />
                  </motion.div>
                )}
              </>
            )}
          </motion.div>

          {/* Slider stillari */}
          <style>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              height: 14px;
              width: 14px;
              border-radius: 50%;
              background: #3b82f6;
              border: 2px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              cursor: pointer;
              transition: transform 0.2s ease;
            }
            .slider::-webkit-slider-thumb:hover {
              transform: scale(1.2);
            }
            .slider::-moz-range-thumb {
              height: 14px;
              width: 14px;
              border-radius: 50%;
              background: #3b82f6;
              border: 2px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              cursor: pointer;
            }
            .slider::-moz-range-thumb:hover {
              transform: scale(1.2);
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MagazineFlipViewer;