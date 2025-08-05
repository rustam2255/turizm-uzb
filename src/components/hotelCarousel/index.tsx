import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import Left from "@assets/icons/moveLeft.svg";
import Right from "@assets/icons/moveRight.svg";
import { useTranslation } from "react-i18next";

import { useGetHomeListQuery } from "@/services/api";
import IMAGE from '@assets/images/place3.png'
interface MultilangText {
  en?: string;
  uz?: string;
  ru?: string;
}

interface MagazineBackgroundImage {
  id: number;
  title: MultilangText;
  home_file: string;
  file_type?: "image" | "video";
  video_image: string | null;
}

const HotelCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume] = useState(0.5);
  const [showVideoControls, setShowVideoControls] = useState(false);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const videoTimes = useRef<Map<number, number>>(new Map()); // Har bir video uchun joriy vaqtni saqlash
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);
  const videoControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language.split("-")[0] as "uz" | "ru" | "en") || "en";
  const { data: backendData, isLoading } = useGetHomeListQuery();

  const hotelSlides: MagazineBackgroundImage[] = (backendData || []).map((item: any) => ({
    video_image: item.video_image,
    id: item.id,
    title: item.title,
    home_file: item.home_file,
    file_type: item.home_file.toLowerCase().endsWith(".mp4") || item.home_file.toLowerCase().endsWith(".webm")
      ? "video"
      : "image",
  }));


  // Tasodifiy indeks tanlash
  useEffect(() => {
    if (hotelSlides.length > 0) {
      const randomIndex = Math.floor(Math.random() * hotelSlides.length);
      setCurrentIndex(randomIndex);
    }
  }, [hotelSlides.length]);

  // Avtomatik slider
  useEffect(() => {
    if (!isVideoPlaying && hotelSlides.length > 1) {
      autoSlideRef.current = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % hotelSlides.length);
      }, 10000);
    }
    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [isVideoPlaying, hotelSlides.length]);

  useEffect(() => {
    const currentSlide = hotelSlides[currentIndex];
    const currentVideo = currentSlide ? videoRefs.current.get(currentSlide.id) : null;

    setIsVideoPlaying(false);
    setShowVideoControls(false);

    if (currentVideo && currentSlide?.file_type === "video") {
      currentVideo.muted = isMuted;
      currentVideo.volume = isMuted ? 0 : volume;
      currentVideo.pause(); // poster yo'qolmasligi uchun
    }

    if (videoControlsTimeoutRef.current) {
      clearTimeout(videoControlsTimeoutRef.current);
    }
  }, [currentIndex]);
  useEffect(() => {
    const currentSlide = hotelSlides[currentIndex];
    const currentVideo = currentSlide ? videoRefs.current.get(currentSlide.id) : null;

    if (currentVideo && currentSlide?.file_type === "video") {
      currentVideo.muted = isMuted;
      currentVideo.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume, currentIndex]);


  // Slayd o'zgarganda video holatini tozalash
  useEffect(() => {
    setIsVideoPlaying(false);
    setShowVideoControls(false);
    if (videoControlsTimeoutRef.current) {
      clearTimeout(videoControlsTimeoutRef.current);
    }
  }, [currentIndex]);

  const handleVideoMouseMove = () => {
    if (isVideoPlaying) {
      setShowVideoControls(true);
      if (videoControlsTimeoutRef.current) {
        clearTimeout(videoControlsTimeoutRef.current);
      }
      videoControlsTimeoutRef.current = setTimeout(() => {
        setShowVideoControls(false);
      }, 5000);
    }
  };

  const handleVideoControlsHover = () => {
    if (videoControlsTimeoutRef.current) {
      clearTimeout(videoControlsTimeoutRef.current);
    }
    setShowVideoControls(true);
  };

  const handleVideoControlsLeave = () => {
    if (videoControlsTimeoutRef.current) {
      clearTimeout(videoControlsTimeoutRef.current);
    }
    videoControlsTimeoutRef.current = setTimeout(() => {
      setShowVideoControls(false);
    }, 3000);
  };

  const getLocalizedText = (field: MultilangText | undefined): string => {
    if (!field) return "";
    return field[currentLang] || field.en || field.uz || field.ru || "";
  };

  const goToSlide = (index: number, dir: number = 1) => {
    if (isTransitioning || !hotelSlides.length) return;
    setDirection(dir);
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const goToNextSlide = () => {
    if (!hotelSlides.length) return;
    const next = (currentIndex + 1) % hotelSlides.length;
    goToSlide(next, 1);
  };

  const goToPrevSlide = () => {
    if (!hotelSlides.length) return;
    const prev = (currentIndex - 1 + hotelSlides.length) % hotelSlides.length;
    goToSlide(prev, -1);
  };

  const handlePlayVideo = async () => {
    const currentSlide = hotelSlides[currentIndex];
    const currentVideo = currentSlide ? videoRefs.current.get(currentSlide.id) : null;

    if (currentSlide?.file_type === "video" && currentVideo) {
      try {
        // Video yuklanganligini tekshirish
        if (currentVideo.readyState < 2) {
          await new Promise((resolve) => {
            currentVideo.addEventListener("loadeddata", resolve, { once: true });
          });
        }

        setIsVideoPlaying(true);
        setShowVideoControls(true);

        // Auto slide to'xtatish
        if (autoSlideRef.current) {
          clearInterval(autoSlideRef.current);
        }

        // Timeout'larni tozalash
        if (videoControlsTimeoutRef.current) {
          clearTimeout(videoControlsTimeoutRef.current);
        }
        videoControlsTimeoutRef.current = setTimeout(() => {
          setShowVideoControls(false);
        }, 5000);

        // Saqlangan vaqtni qayta o'rnatish
        const savedTime = videoTimes.current.get(currentSlide.id) || 0;
        currentVideo.currentTime = savedTime;
        await currentVideo.play();
      } catch (error) {
        console.error(`Video o'ynatish xatosi (ID: ${currentSlide.id}):`, error);
        setIsVideoPlaying(false);
      }
    }
  };

  const toggleVideoPause = async () => {
    const currentSlide = hotelSlides[currentIndex];
    const currentVideo = currentSlide ? videoRefs.current.get(currentSlide.id) : null;

    if (currentVideo && currentSlide?.file_type === "video") {
      try {
        if (isVideoPlaying) {
          videoTimes.current.set(currentSlide.id, currentVideo.currentTime); // Joriy vaqtni saqlash
          currentVideo.pause();
          setIsVideoPlaying(false);
        } else {
          const savedTime = videoTimes.current.get(currentSlide.id) || 0;
          currentVideo.currentTime = savedTime; // Saqlangan vaqtdan davom ettirish
          await currentVideo.play();
          setIsVideoPlaying(true);
          setShowVideoControls(true);
        }
      } catch (error) {
        console.error(`Video pause/play xatosi (ID: ${currentSlide.id}):`, error);
        setIsVideoPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    const currentSlide = hotelSlides[currentIndex];
    const currentVideo = currentSlide ? videoRefs.current.get(currentSlide.id) : null;

    if (currentVideo) {
      // Joriy vaqtni saqlash
      videoTimes.current.set(currentSlide.id, currentVideo.currentTime);
      setIsMuted((prev) => !prev);
    }
  };

  const handleVideoLoadedData = (slideId: number) => {
    const video = videoRefs.current.get(slideId);
    if (video) {
      video.muted = isMuted;
      video.volume = isMuted ? 0 : volume;
      video.pause(); // Yuklangandan keyin to'xtatamiz -> poster ko'rinib turadi
    }
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
    setShowVideoControls(false);
    const currentSlide = hotelSlides[currentIndex];
    if (currentSlide) {
      videoTimes.current.set(currentSlide.id, 0); // Video tugaganda vaqtni 0 ga o'rnatish
    }
  };

  const handleVideoError = (e: any, slideId: number) => {
    console.error(`Video yuklash xatosi (ID: ${slideId}):`, e);
    setIsVideoPlaying(false);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.05,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.95,
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        <span className="ml-4 text-white text-xl">{t("loading")}</span>
      </div>
    );
  }

  if (!hotelSlides.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <span className="text-white text-xl">{t("noSlidesAvailable")}</span>
      </div>
    );
  }

  const prevIndex = (currentIndex - 1 + hotelSlides.length) % hotelSlides.length;
  const nextIndex = (currentIndex + 1) % hotelSlides.length;
  const activeSlide = hotelSlides[currentIndex];
  const leftSlide = hotelSlides[prevIndex];
  const rightSlide = hotelSlides[nextIndex];

  const renderMedia = (slide: MagazineBackgroundImage) => {
    if (slide.file_type === "video") {
      return (
        <motion.video
          ref={(el) => {
            if (el) {
              videoRefs.current.set(slide.id, el);
            } else {
              videoRefs.current.delete(slide.id);
              videoTimes.current.delete(slide.id); // Ref o'chirilganda vaqtni ham o'chirish
            }
          }}
          key={slide.id}
          src={slide.home_file}
          poster={slide.video_image || IMAGE}
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          className="absolute w-full h-full object-cover shadow-lg"
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          custom={direction}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onMouseMove={handleVideoMouseMove}
          onMouseLeave={() => {
            if (!isVideoPlaying) return; // faqat video o'ynayotgan bo'lsa controlsni yashiramiz
            if (videoControlsTimeoutRef.current) {
              clearTimeout(videoControlsTimeoutRef.current);
            }
            videoControlsTimeoutRef.current = setTimeout(() => {
              setShowVideoControls(false);
            }, 2000);
          }}
          onLoadedData={() => handleVideoLoadedData(slide.id)}
          onEnded={handleVideoEnded}
          onError={(e) => handleVideoError(e, slide.id)}

        />
      );
    }
    return (
      <motion.img
        key={slide.id}
        src={slide.home_file}
        alt={getLocalizedText(slide.title)}
        className="absolute w-full h-full object-cover z-10 shadow-lg"
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        custom={direction}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        onError={(e) => console.error(`Rasm yuklash xatosi (ID: ${slide.id}):`, e)}
      />
    );
  };

  return (
    <div className="relative w-full" id="home">
      

      <div className="relative w-full h-[80vh] lg:h-[80vh] overflow-hidden z-10">
        <AnimatePresence initial={false} custom={direction}>
          {renderMedia(activeSlide)}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
        </AnimatePresence>

        {activeSlide.file_type === "video" && !isVideoPlaying && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-40 h-40 flex items-center justify-center"
            >
              <svg className="w-full h-full" viewBox="0 0 160 160">
                <defs>
                  <path
                    id="circle"
                    d="M 80, 80 m -65, 0 a 65,65 0 1,1 130,0 a 65,65 0 1,1 -130,0"
                  />
                </defs>
                <text className="text-[11px] fill-white/90 font-light tracking-[0.35em] drop-shadow-lg">
                  <textPath href="#circle" startOffset="0%">
                    SHOWREEL • SHOWREEL • SHOWREEL • SHOWREEL •
                  </textPath>
                </text>
              </svg>
            </motion.div>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 40px rgba(77, 199, 232, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayVideo}
              className="relative w-24 h-24 bg-white/15 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center group transition-all duration-300 ml-8 mt-8"
              style={{
                boxShadow: "0 8px 32px rgba(77, 199, 232, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(77, 199, 232, 0.2), rgba(77, 199, 232, 0.1))",
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-2 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(77, 199, 232, 0.1), transparent 70%)",
                }}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="flex items-center justify-center w-full h-full">
                <Play size={36} className="text-white relative z-10 drop-shadow-lg" fill="currentColor" />
              </div>
            </motion.button>

            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: "rgba(77, 199, 232, 0.6)",
                  boxShadow: "0 0 6px rgba(77, 199, 232, 0.8)",
                  top: "50%",
                  left: "50%",
                }}
                animate={{
                  x: [0, Math.cos((i * 45 * Math.PI) / 180) * 80],
                  y: [0, Math.sin((i * 45 * Math.PI) / 180) * 80],
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}

        {activeSlide.file_type === "video" && isVideoPlaying && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, x: -60, scale: 0.8 }}
              animate={{
                opacity: showVideoControls ? 1 : 0.3,
                x: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  staggerChildren: 0.1,
                },
              }}
              exit={{ opacity: 0, x: -60, scale: 0.8, transition: { duration: 0.2 } }}
              className="absolute top-24 left-6 z-30"
              onMouseEnter={handleVideoControlsHover}
              onMouseLeave={handleVideoControlsLeave}
            >
              <motion.div
                className="flex flex-col gap-4 bg-black/50 backdrop-blur-2xl p-4 rounded-xl border border-white/20"
                style={{
                  boxShadow: `
                    0 20px 60px rgba(77, 199, 232, 0.2),
                    0 8px 32px rgba(0, 0, 0, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15)
                  `,
                }}
              >
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(77, 199, 232, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleVideoPause}
                  className="relative p-4 bg-white/15 rounded-xl hover:bg-white/25 transition-all duration-300 group overflow-hidden"
                  style={{
                    boxShadow: "0 4px 16px rgba(77, 199, 232, 0.15)",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(135deg, rgba(77, 199, 232, 0.15), rgba(77, 199, 232, 0.08))",
                    }}
                  />
                  <AnimatePresence mode="wait">
                    {isVideoPlaying ? (
                      <motion.div
                        key="pause"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <Pause size={24} className="text-white relative z-10" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <div className="flex items-center justify-center">
                          <Play size={24} className="text-white relative z-10" fill="currentColor" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(77, 199, 232, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMute}
                  className="relative p-4 bg-white/15 rounded-xl hover:bg-white/25 transition-all duration-300 group overflow-hidden"
                  style={{
                    boxShadow: "0 4px 16px rgba(77, 199, 232, 0.15)",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(135deg, rgba(77, 199, 232, 0.15), rgba(77, 199, 232, 0.08))",
                    }}
                  />
                  <AnimatePresence mode="wait">
                    {isMuted ? (
                      <motion.div
                        key="muted"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <VolumeX size={24} className="text-white relative z-10" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="volume"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <Volume2 size={24} className="text-white relative z-10" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{ background: "rgba(77, 199, 232, 0.7)" }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full"
                  style={{ background: "rgba(77, 199, 232, 0.5)" }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        <motion.div
          className="absolute w-[300px] sm:w-[250px] md:w-[350px] lg:w-[405px] bottom-[120px] sm:bottom-[100px] md:bottom-[140px] left-1/2 -translate-x-1/2 text-white bg-transparent z-20"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          key={getLocalizedText(activeSlide.title) + "_text"}
        >
          <h2 className="text-[28px] text-center leading-[38px] md:leading-[50px] font-normal drop-shadow-2xl">
            {getLocalizedText(activeSlide.title)}
          </h2>
        </motion.div>

        <motion.div
          className="hidden md:block absolute border-t pt-1 border-[#878787] space-y-[10px] top-[50%] md:top-[84%] left-[20px] md:left-[40px] lg:left-[80px] text-white bg-transparent max-w-xs z-20"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          key={leftSlide.id + "_left"}
        >
          <h2 className="text-[18px] md:text-[20px] font-normal leading-[26px] mt-1 drop-shadow-lg">
            {getLocalizedText(leftSlide.title)}
          </h2>
        </motion.div>

        <motion.div
          className="hidden md:block absolute border-t pt-1 border-[#878787] space-y-[10px] top-[70%] md:top-[84%] right-[20px] md:right-[40px] lg:right-[80px] text-white bg-transparent max-w-xs z-20"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          key={rightSlide.id + "_right"}
        >
          <h2 className="text-[18px] md:text-[20px] font-normal leading-[26px] mt-1 drop-shadow-lg">
            {getLocalizedText(rightSlide.title)}
          </h2>
        </motion.div>

        <div className="absolute bottom-[80px] md:bottom-[100px] left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {hotelSlides.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => goToSlide(index, index > currentIndex ? 1 : -1)}
              className={`h-2 w-12 cursor-pointer transition-all duration-300 rounded-full ${currentIndex === index ? "bg-white shadow-lg" : "bg-white/40 hover:bg-white/60"}`}
              disabled={isTransitioning}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToPrevSlide}
          disabled={isTransitioning}
          className="absolute bottom-[90px] md:bottom-[110px] left-[20px] md:left-[40px] lg:left-[80px] text-white transition-all cursor-pointer z-20 p-3 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 disabled:opacity-50"
        >
          <img src={Left} alt="Chap" className="w-8 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToNextSlide}
          disabled={isTransitioning}
          className="absolute bottom-[90px] md:bottom-[110px] right-[20px] md:right-[40px] lg:right-[80px] text-white transition-all cursor-pointer z-20 p-3 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 disabled:opacity-50"
        >
          <img src={Right} alt="O'ng" className="w-8 h-6" />
        </motion.button>
      </div>
    </div>
  );
};

export default HotelCarousel;