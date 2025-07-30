import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Left from "@assets/icons/moveLeft.svg";
import Right from "@assets/icons/moveRight.svg";
import { useTranslation } from "react-i18next";
import Navbar from "../navbar";
import { useGetHomeListQuery } from "@/services/api";

interface MultilangText {
  en?: string;
  uz?: string;
  ru?: string;
}

interface HomeList {
  id: number;
  title: MultilangText;
  home_file: string;
}

const HotelCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language.split("-")[0] as "uz" | "ru" | "en") || "en";
  const { data, isLoading } = useGetHomeListQuery();
  const hotelSlides: HomeList[] = data || [];

  const getLocalizedText = (field: MultilangText | undefined): string => {
    if (!field) return "";
    return field[currentLang] || field.en || field.uz || field.ru || "";
  };

  const autoPlay = true;
  const autoPlayInterval = 3000;

  const goToSlide = useCallback(
    (index: number, dir: number = 1) => {
      if (isTransitioning || !hotelSlides.length) return;
      setDirection(dir);
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [isTransitioning, hotelSlides]
  );

  const goToNextSlide = useCallback(() => {
    if (!hotelSlides.length) return;
    const next = (currentIndex + 1) % hotelSlides.length;
    goToSlide(next, 1);
  }, [currentIndex, goToSlide, hotelSlides]);

  const goToPrevSlide = () => {
    if (!hotelSlides.length) return;
    const prev = (currentIndex - 1 + hotelSlides.length) % hotelSlides.length;
    goToSlide(prev, -1);
  };

  const startAutoPlay = useCallback(() => {
    if (autoPlay && !autoPlayRef.current && hotelSlides.length) {
      autoPlayRef.current = setInterval(() => {
        goToNextSlide();
      }, autoPlayInterval);
    }
  }, [goToNextSlide, hotelSlides]);

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (!hotelSlides.length) {
    return <div>{t("noSlidesAvailable")}</div>;
  }

  const prevIndex = (currentIndex - 1 + hotelSlides.length) % hotelSlides.length;
  const nextIndex = (currentIndex + 1) % hotelSlides.length;
  const activeSlide = hotelSlides[currentIndex];
  const leftSlide = hotelSlides[prevIndex];
  const rightSlide = hotelSlides[nextIndex];

  return (
    <div className="relative w-full" id="home">
      {/* Navbar at top */}
      <div className="relative w-full z-[9999]">
        <Navbar />
      </div>

      {/* Carousel Section */}
      <div
        className="relative w-full h-[500px] sm:h-[350px] md:h-[450px] lg:h-[850px] overflow-hidden z-10"
        onMouseEnter={stopAutoPlay}
        onMouseLeave={startAutoPlay}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={activeSlide.id}
            src={activeSlide.home_file}
            alt={getLocalizedText(activeSlide.title)}
            className="absolute w-full h-full object-cover z-10"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 custom-gradient z-10" />
        </AnimatePresence>

        <motion.div
          className="absolute w-[300px] sm:w-[250px] md:w-[350px] lg:w-[405px] bottom-[60px] sm:bottom-[40px] md:bottom-[80px] left-1/2 -translate-x-1/2 text-white bg-transparent z-20"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          key={getLocalizedText(activeSlide.title) + "_text"}
        >
          <h2 className="text-[28px] text-center leading-[38px] md:leading-[50px] font-normal">
            {getLocalizedText(activeSlide.title)}
          </h2>
        </motion.div>

        <motion.div
          className="hidden md:block absolute border-t pt-1 border-[#878787] space-y-[10px] top-[70%] md:top-[76%] left-[20px] md:left-[40px] lg:left-[80px] text-white bg-transparent max-w-xs z-20"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          key={leftSlide.id + "_left"}
        >
          <h2 className="text-[18px] md:text-[20px] font-normal leading-[26px] mt-1">
            {getLocalizedText(leftSlide.title)}
          </h2>
        </motion.div>

        <motion.div
          className="hidden md:block absolute border-t pt-1 border-[#878787] space-y-[10px] top-[70%] md:top-[76%] right-[20px] md:right-[40px] lg:right-[80px] text-white bg-transparent max-w-xs z-20"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          key={rightSlide.id + "_right"}
        >
          <h2 className="text-[18px] md:text-[20px] font-normal leading-[26px] mt-1">
            {getLocalizedText(rightSlide.title)}
          </h2>
        </motion.div>

        <div className="absolute bottom-[20px] md:bottom-[40px] left-1/2 -translate-x-1/2 flex z-20">
          {hotelSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index, index > currentIndex ? 1 : -1)}
              className={`h-1 w-12 cursor-pointer transition-all ${
                currentIndex === index ? "bg-white" : "bg-white/30"
              }`}
              disabled={isTransitioning}
            />
          ))}
        </div>

        <button
          onClick={goToPrevSlide}
          disabled={isTransitioning}
          className="absolute bottom-[30px] md:bottom-[40px] left-[20px] md:left-[40px] lg:left-[80px] text-white transition-all cursor-pointer z-20"
        >
          <img src={Left} alt="Left" className="w-8 h-6" />
        </button>

        <button
          onClick={goToNextSlide}
          disabled={isTransitioning}
          className="absolute bottom-[30px] md:bottom-[40px] right-[20px] md:right-[40px] lg:right-[80px] text-white transition-all cursor-pointer z-20"
        >
          <img src={Right} alt="Right" className="w-8 h-6" />
        </button>
      </div>
    </div>
  );
};

export default HotelCarousel;