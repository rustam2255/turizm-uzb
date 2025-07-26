import { useState, useEffect, useCallback, useRef } from "react";
import Image1 from "@assets/images/samarkand-img.png";
import Image2 from "@assets/images/image2.png";
import Image3 from "@assets/images/image3.png";
import { motion, AnimatePresence } from "framer-motion";
import Left from "@assets/icons/moveLeft.svg";
import Right from "@assets/icons/moveRight.svg";
import { useTranslation } from "react-i18next"
import Navbar from "../navbar";

const HotelCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { t } = useTranslation();
    const hotelSlides = [
        {
            id: 1,
            name: t("carousel.slides.0.name"),
            category: t("carousel.slides.0.category"),
            image: Image1,
        },
        {
            id: 2,
            name: t("carousel.slides.1.name"),
            category: t("carousel.slides.1.category"),
            image: Image2,
        },
        {
            id: 3,
            name: t("carousel.slides.2.name"),
            category: t("carousel.slides.2.category"),
            image: Image3,
        },
    ];

    const autoPlay = true;
    const autoPlayInterval = 3000;

    const goToSlide = useCallback((index: number, dir: number = 1) => {
        if (isTransitioning) return;
        setDirection(dir);
        setIsTransitioning(true);
        setCurrentIndex(index);
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    }, [isTransitioning]);

    const goToNextSlide = useCallback(() => {
        const next = (currentIndex + 1) % hotelSlides.length;
        goToSlide(next, 1);
    }, [currentIndex, goToSlide]);

    const goToPrevSlide = () => {
        const prev = (currentIndex - 1 + hotelSlides.length) % hotelSlides.length;
        goToSlide(prev, -1);
    };

    const startAutoPlay = useCallback(() => {
        if (autoPlay && !autoPlayRef.current) {
            autoPlayRef.current = setInterval(() => {
                goToNextSlide();
            }, autoPlayInterval);
        }
    }, [goToNextSlide]);

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

    const prevIndex = (currentIndex - 1 + hotelSlides.length) % hotelSlides.length;
    const nextIndex = (currentIndex + 1) % hotelSlides.length;
    const activeSlide = hotelSlides[currentIndex];
    const leftSlide = hotelSlides[prevIndex];
    const rightSlide = hotelSlides[nextIndex];

    return (
        <div className="relative w-full" id="home">
            {/* Navbar at top */}
            <div className="relative w-full z-50">
                <Navbar />
            </div>
            
            {/* Carousel Section */}
            <div
                className="relative w-full h-[500px] sm:h-[350px] md:h-[450px] lg:h-[850px] overflow-hidden"
                onMouseEnter={stopAutoPlay}
                onMouseLeave={startAutoPlay}
            >
                <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                        key={activeSlide.id}
                        src={activeSlide.image}
                        alt={activeSlide.name}
                        className="absolute w-full h-full object-cover"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        custom={direction}
                        transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 custom-gradient" />
                </AnimatePresence>

                <motion.div
                    className="absolute w-[300px] sm:w-[250px] md:w-[350px] lg:w-[405px] bottom-[60px] sm:bottom-[40px] md:bottom-[80px] left-1/2 -translate-x-1/2 text-white bg-transparent"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    key={activeSlide.name + "_text"}
                >
                    <p className="text-[14px] md:text-[14px] text-center font-normal leading-[18px] uppercase">
                        {activeSlide.category}
                    </p>
                    <h2 className="text-[28px] text-center leading-[38px] md:leading-[50px] font-normal">
                        {activeSlide.name}
                    </h2>
                </motion.div>

                <motion.div
                    className="hidden md:block absolute border-t pt-1 border-[#878787] space-y-[10px] top-[70%] md:top-[76%] left-[20px] md:left-[40px] lg:left-[80px] text-white bg-transparent max-w-xs"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    key={leftSlide.id + "_left"}
                >
                    <p className="text-[14px] font-normal leading-[19px] uppercase">{leftSlide.category}</p>
                    <h2 className="text-[18px] md:text-[20px] font-normal leading-[26px] mt-1">{leftSlide.name}</h2>
                </motion.div>

                <motion.div
                    className="hidden md:block absolute border-t pt-1 border-[#878787] space-y-[10px] top-[70%] md:top-[76%] right-[20px] md:right-[40px] lg:right-[80px] text-white bg-transparent max-w-xs"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    key={rightSlide.id + "_right"}
                >
                    <p className="text-[14px] font-normal leading-[19px] uppercase">{rightSlide.category}</p>
                    <h2 className="text-[18px] md:text-[20px] font-normal leading-[26px] mt-1">{rightSlide.name}</h2>
                </motion.div>

                <div className="absolute bottom-[20px] md:bottom-[40px] left-1/2 -translate-x-1/2 flex ">
                    {hotelSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index, index > currentIndex ? 1 : -1)}
                            className={`h-1 w-12 cursor-pointer transition-all ${currentIndex === index ? "bg-white" : "bg-white/30"}`}
                            disabled={isTransitioning}
                        />
                    ))}
                </div>

                <button
                    onClick={goToPrevSlide}
                    disabled={isTransitioning}
                    className="absolute bottom-[30px] md:bottom-[40px] left-[20px] md:left-[40px] lg:left-[80px] text-white transition-all cursor-pointer"
                >
                    <img src={Left} alt="Left" className="w-8 h-6" />
                </button>

                <button
                    onClick={goToNextSlide}
                    disabled={isTransitioning}
                    className="absolute bottom-[30px] md:bottom-[40px] right-[20px] md:right-[40px] lg:right-[80px] text-white transition-all cursor-pointer"
                >
                    <img src={Right} alt="Right" className="w-8 h-6" />
                </button>
            </div>
        </div>
    );
};

export default HotelCarousel;