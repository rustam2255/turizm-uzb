import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import HotelCard from '@/components/hotelCard/hotelCardUI';
import SubNavbar from '@/components/navbar/subNavbar';
import NewsArticle from '@/components/newsArticle';
import TravelCollection from '@/components/travelCollection';
import HomeCarousel from '@components/hotelCarousel';

const Home = () => {
  type SectionId = 'home' | 'media' | 'hotelCard' | 'detanation';
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isSticky, setIsSticky] = useState(false);

  // Refs for each section to detect when they are in view
  const mediaRef = useRef(null);
  const hotelCardRef = useRef(null);
  const detanationRef = useRef(null);

  // UseInView hooks to detect when sections are visible
  const isMediaInView = useInView(mediaRef, { once: true, margin: '-100px' });
  const isHotelCardInView = useInView(hotelCardRef, { once: true, margin: '-100px' });
  const isDetanationInView = useInView(detanationRef, { once: true, margin: '-100px' });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Get carousel height dynamically
      const homeSection = document.getElementById('home');
      const carouselHeight = homeSection ? homeSection.offsetHeight : window.innerHeight;

      // SubNavbar becomes sticky when scrolling past carousel
      setIsSticky(scrollY > carouselHeight - 100);

      // Dynamic section detection
      const sections: SectionId[] = ['home', 'media', 'hotelCard', 'detanation'];
      let currentSection: SectionId = 'home';

      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollY;

          if (scrollY >= elementTop - 200) {
            currentSection = sectionId;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Animation variants for different directions
  const slideInVariants = {
    hidden: (direction: string) => ({
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      y: direction === 'bottom' ? 100 : 0,
      opacity: 0,
    }),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div>
      {/* Home Section */}
      <div id="home" className="relative">
        <div className="m-4 md:m-10">
          <HomeCarousel />
        </div>

        {/* SubNavbar */}
        <div
          className={`
            w-full z-50 transition-all duration-300 ease-in-out
            ${isSticky 
              ? 'fixed top-0 left-0 bg-black/90 backdrop-blur-sm shadow-lg' 
              : 'absolute bottom-0 left-0 transform translate-y-1/2'
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

      {/* Content Sections with Animations */}
      <div className={`${isSticky ? 'pt-1' : 'pt-1'} md:pt-5 lg:pt-5 font-serif transition-all duration-300`}>
        <motion.div
          id="media"
          ref={mediaRef}
          className="scroll-mt-10"
          initial="hidden"
          animate={isMediaInView ? 'visible' : 'hidden'}
          variants={slideInVariants}
          custom="left" // Slide in from left
        >
          <NewsArticle />
        </motion.div>

        <motion.div
          id="hotelCard"
          ref={hotelCardRef}
          className="px-4 md:px-20 lg:px-[80px] bg-[#F2F4F7] scroll-mt-20"
          initial="hidden"
          animate={isHotelCardInView ? 'visible' : 'hidden'}
          variants={slideInVariants}
          custom="right" // Slide in from right
        >
          <HotelCard />
        </motion.div>

        <motion.div
          id="detanation"
          ref={detanationRef}
          className="px-4 md:px-20 lg:px-[80px] scroll-mt-20"
          initial="hidden"
          animate={isDetanationInView ? 'visible' : 'hidden'}
          variants={slideInVariants}
          custom="bottom" // Slide in from bottom
        >
          <TravelCollection />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;