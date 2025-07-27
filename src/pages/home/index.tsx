import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import HotelCard from '@/components/hotelCard/hotelCardUI';
import SubNavbar from '@/components/navbar/subNavbar';
import NewsArticle from '@/components/newsArticle';
import TravelCollection from '@/components/travelCollection';
import HomeCarousel from '@components/hotelCarousel';
import MagazineHome from '@/components/subnavbarPages/magazine';
import ResortMapHome from '@/components/subnavbarPages/resort';
import BankHome from '@/components/subnavbarPages/bank';
import ClinicHome from '@/components/subnavbarPages/clinics';
import ShopHome from '@/components/subnavbarPages/market';

type SectionId = 'home' | 'media' | 'hotelCard' | 'detanation' | 'magazine' | 'resort' | 'bank' | 'clinic' | 'market';

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isSticky, setIsSticky] = useState<boolean>(false);

  // Section refs
  const sectionRefs = {
    media: useRef<HTMLDivElement>(null),
    hotelCard: useRef<HTMLDivElement>(null),
    detanation: useRef<HTMLDivElement>(null),
    magazine: useRef<HTMLDivElement>(null),
    resort: useRef<HTMLDivElement>(null),
    bank: useRef<HTMLDivElement>(null),
    clinic: useRef<HTMLDivElement>(null),
    market: useRef<HTMLDivElement>(null),
  };

  // InView hooks
  const isMediaInView = useInView(sectionRefs.media, { once: false, margin: '-20% 0px' });
  const isHotelCardInView = useInView(sectionRefs.hotelCard, { once: false, margin: '-20% 0px' });
  const isDetanationInView = useInView(sectionRefs.detanation, { once: false, margin: '-20% 0px' });
  const isMagazineInView = useInView(sectionRefs.magazine, { once: false, margin: '-20% 0px' });
  const isResortInView = useInView(sectionRefs.resort, { once: false, margin: '-20% 0px' });
  const isBankInView = useInView(sectionRefs.bank, { once: false, margin: '-20% 0px' });
  const isClinicInView = useInView(sectionRefs.clinic, { once: false, margin: '-20% 0px' });
  const isMarketInView = useInView(sectionRefs.market, { once: false, margin: '-20% 0px' });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const homeSection = document.getElementById('home');
      const carouselHeight = homeSection ? homeSection.offsetHeight : window.innerHeight;

      setIsSticky(scrollY > carouselHeight - 100);

      const sections: SectionId[] = ['home', 'media', 'magazine', 'hotelCard', 'resort', 'bank', 'clinic', 'market', 'detanation'];
      let currentSection: SectionId = 'home';

      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Sticky navbar balandligini hisobga olish
          const offset = isSticky ? 80 : 200;
          if (rect.top <= offset && rect.bottom >= offset) {
            currentSection = sectionId;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSticky]);

  // Animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50 dark:bg-black font-sans">
      {/* Home Section */}
      <div id="home" className="relative">
        <div >
          <HomeCarousel />
        </div>
        <div
          className={`
            w-full z-50 transition-all duration-300
            ${isSticky
              ? 'fixed top-0 left-0 bg-white/90 backdrop-blur-md shadow-lg'
              : 'absolute bottom-0 left-0 transform translate-y-full md:translate-y-1/2'
            }
          `}
        >
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <SubNavbar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className={`${isSticky ? 'pt-20' : 'pt-10'} md:pt-10`}>
        <motion.div
          id="media"
          ref={sectionRefs.media}
          className="bg-white"
          initial="hidden"
          animate={isMediaInView ? 'visible' : 'hidden'}
          variants={slideInLeft}
        >
          <NewsArticle />
        </motion.div>

        <motion.div
          id="magazine"
          ref={sectionRefs.magazine}
          className="px-4 md:px-10 lg:px-20 py-10 bg-gray-100 scroll-mt-20"
          initial="hidden"
          animate={isMagazineInView ? 'visible' : 'hidden'}
          variants={fadeInUp}
        >
          <MagazineHome />
        </motion.div>

        <motion.div
          id="hotelCard"
          ref={sectionRefs.hotelCard}
          className="px-4 md:px-10 lg:px-20 py-0 bg-gray-100 scroll-mt-20"
          initial="hidden"
          animate={isHotelCardInView ? 'visible' : 'hidden'}
          variants={slideInRight}
        >
          <HotelCard />
        </motion.div>

        <motion.div
          id="resort"
          ref={sectionRefs.resort}
          className="px-4 md:px-10 lg:px-20 py-10 bg-white scroll-mt-20"
          initial="hidden"
          animate={isResortInView ? 'visible' : 'hidden'}
          variants={fadeInUp}
        >
          <ResortMapHome />
        </motion.div>

        <motion.div
          id="bank"
          ref={sectionRefs.bank}
          className="px-4 md:px-10 lg:px-20 py-10 bg-gray-100 scroll-mt-20"
          initial="hidden"
          animate={isBankInView ? 'visible' : 'hidden'}
          variants={slideInLeft}
        >
          <BankHome />
        </motion.div>

        <motion.div
          id="clinic"
          ref={sectionRefs.clinic}
          className="px-4 md:px-10 lg:px-20 py-10 bg-white scroll-mt-20"
          initial="hidden"
          animate={isClinicInView ? 'visible' : 'hidden'}
          variants={slideInRight}
        >
          <ClinicHome />
        </motion.div>

        <motion.div
          id="market"
          ref={sectionRefs.market}
          className="px-4 md:px-10 lg:px-20 py-10 bg-gray-100 scroll-mt-20"
          initial="hidden"
          animate={isMarketInView ? 'visible' : 'hidden'}
          variants={fadeInUp}
        >
          <ShopHome />
        </motion.div>

        <motion.div
          id="detanation"
          ref={sectionRefs.detanation}
          className="px-4 md:px-10 lg:px-20 py-10 bg-white scroll-mt-20"
          initial="hidden"
          animate={isDetanationInView ? 'visible' : 'hidden'}
          variants={slideInLeft}
        >
          <TravelCollection />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;