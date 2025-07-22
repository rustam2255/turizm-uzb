import { useEffect, useState } from 'react';
import HotelCard from '@/components/hotelCard/hotelCardUI';
import SubNavbar from '@/components/navbar/subNavbar';
import NewsArticle from '@/components/newsArticle';
import TravelCollection from '@/components/travelCollection';
import HomeCarousel from '@components/hotelCarousel';

const Home = () => {
  type SectionId = 'home' | 'media' | 'hotelCard' | 'detanation';
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isSticky, setIsSticky] = useState(false);

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
      
      // Get actual section positions
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollY;
          
          // Check if section is currently visible (with some offset for better UX)
          if (scrollY >= elementTop - 200) {
            currentSection = sectionId;
          }
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Handle window resize
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Home Section */}
      <div id="home" className="relative">
        <div className="m-4 md:m-10">
          <HomeCarousel />
        </div>
        
        {/* SubNavbar positioned at the bottom of carousel */}
        <div className={`
          w-full z-50 transition-all  duration-300 ease-in-out
          ${isSticky 
            ? 'fixed top-0 left-0 bg-black/90 backdrop-blur-sm shadow-lg' 
            : 'absolute bottom-0 left-0 transform translate-y-1/2'
          }
        `}>
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <SubNavbar 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
            />
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className={`${isSticky ? 'pt-1' : 'pt-1'} md:pt-5 lg:pt-5 font-serif transition-all duration-300`}>
        <div id="media" className="scroll-mt-10">
          <NewsArticle />
        </div>
        
        <div id="hotelCard" className="px-4 md:px-20 lg:px-[80px] bg-[#F2F4F7] scroll-mt-20">
          <HotelCard />
        </div>
        
        <div id="detanation" className="px-4 md:px-20 lg:px-[80px] scroll-mt-20">
          <TravelCollection />
        </div>
      </div>
    </div>
  );
};

export default Home;