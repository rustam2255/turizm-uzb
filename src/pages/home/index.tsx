import { useEffect, useState, useRef } from 'react';
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
import { Helmet } from 'react-helmet-async';
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






  return (
    <div
      className={`relative min-h-screen overflow-x-hidden font-sans bg-white dark:bg-[oklch(22%_0.06_265/0.9)]`}
    >
      <Helmet>
        <title>Eng yaxshi sayohat, turizm va xizmatlar – MySite</title>
        <meta name="description" content="MySite orqali mehmonxonalar, turistik joylar, transport va boshqa xizmatlarni toping. Sayohatlaringizni rejalashtiring va eng yaxshi xizmatlardan foydalaning." />
        <meta property="og:title" content="Eng yaxshi sayohat, turizm va xizmatlar – MySite" />
        <meta property="og:description" content="MySite orqali mehmonxonalar, turistik joylar, transport va boshqa xizmatlarni toping. Sayohatlaringizni rejalashtiring va eng yaxshi xizmatlardan foydalaning." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tourism-uzbekistan.uz/" />
        <meta property="og:image" content="https://tourism-uzbekistan.uz/image" />
      </Helmet>



      {/* Home Section */}
      <div id="home" className="relative bg-gray-200">
        <div className='p-10 '>
          <HomeCarousel />
        </div>
        <div
          className={`
            w-full z-50 transition-all duration-300
            ${isSticky
              ? `fixed top-0 left-0  bg-white/90 dark:bg-[oklch(22%_0.06_265/0.9)]   backdrop-blur-md shadow-lg`
              : 'absolute bottom-0 left-0 transformtranslate-y-full md:translate-y-1/2'
            }
          `}
        >
          <div className="max-w-[1600px] mx-auto px-4 hidden  md:block sm:px-6 lg:px-8">
            <SubNavbar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className={`pt-2 md:pt-5`}>
        <div
          id="magazine"
          ref={sectionRefs.magazine}
          className={`px-1 md:px-3 lg:px-20 $bg-white dark:bg-[oklch(22%_0.06_265/0.9)] `}

        >
          <MagazineHome />
        </div>

        <div
          id="hotelCard"
          ref={sectionRefs.hotelCard}
          className={`px-1 md:px-3 lg:px-20 bg-white dark:bg-[oklch(22%_0.06_265/0.9)]`}

        >
          <HotelCard />
        </div>

        <div
          id="resort"
          ref={sectionRefs.resort}
          className={`px-1 md:px-3 lg:px-20 bg-white dark:bg-[oklch(22%_0.06_265/0.9)]`}

        >
          <ResortMapHome />
        </div>

        <div
          id="bank"
          ref={sectionRefs.bank}
          className={`px-1 md:px-3 lg:px-20 bg-white dark:bg-[oklch(22%_0.06_265/0.9)]`}

        >
          <BankHome />
        </div>

        <div
          id="clinic"
          ref={sectionRefs.clinic}
          className={`px-1 md:px-3 lg:px-20 bg-white dark:bg-[oklch(22%_0.06_265/0.9)]`}

        >
          <ClinicHome />
        </div>

        <div
          id="market"
          ref={sectionRefs.market}
          className={`px-1 md:px-3 lg:px-20 bg-white dark:bg-[oklch(22%_0.06_265/0.9)]`}


        >
          <ShopHome />
        </div>

        <div
          id="detanation"
          ref={sectionRefs.detanation}
          className={`px-1 md:px-3 lg:px-20 bg-white dark:bg-[oklch(22%_0.06_265/0.9)]`}
        >
          <TravelCollection />
        </div>
        <div
          id="media"
          ref={sectionRefs.media}
          className='bg-white dark:bg-[oklch(22%_0.06_265/0.9)]'

        >
          <NewsArticle />
        </div>

      </div>
    </div>
  );
};

export default Home;