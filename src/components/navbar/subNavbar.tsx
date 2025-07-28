import React from 'react';
import { useTranslation } from 'react-i18next';

type SectionId = 'home' | 'media' | 'hotelCard' | 'detanation' | 'magazine' | 'resort' | 'bank' | 'clinic' | 'market';

interface SubNavbarProps {
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
}

const SubNavbar: React.FC<SubNavbarProps> = ({ activeSection, setActiveSection }) => {
  const { t } = useTranslation();

  const NavbarItem = [
    { id: 'home' as SectionId, title: t('subNavbar.home'), link: '/' },
    { id: 'media' as SectionId, title: t('subNavbar.media'), link: '/article' },
    { id: 'magazine' as SectionId, title: t('subNavbar.magazines'), link: '/magazines' },
    { id: 'hotelCard' as SectionId, title: t('subNavbar.hotels'), link: '/hotels' },
    { id: 'resort' as SectionId, title: t('subNavbar.resorts'), link: '/resort' },
    { id: 'bank' as SectionId, title: t('subNavbar.banks'), link: '/banks' },
    { id: 'clinic' as SectionId, title: t('subNavbar.clinics'), link: '/clinics' },
    { id: 'market' as SectionId, title: t('subNavbar.markets'), link: '/market' },
    { id: 'detanation' as SectionId, title: t('subNavbar.detenation'), link: '/destinations' },
  ];

  const handleScroll = (id: SectionId) => {
    const section = document.getElementById(id);
    if (section) {
      const headerOffset = 120; // Sticky header balandligiga moslashtiring
      const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="w-full  py-2 sm:py-4">
      <div className="mx-4 sm:mx-auto max-w-[1300px]">
        {/* Desktop Navbar */}
        <div className="hidden h-[70px] lg:grid lg:grid-cols-9 gap-2 px-2 py-1 bg-gradient-to-r from-white/90 via-sky-50/80 to-white/90 backdrop-blur-md rounded-2xl shadow-lg">
          {NavbarItem.map((item) => (
            <button
              key={item.id}
              onClick={() => handleScroll(item.id)}
              className={`
                px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full
                ${activeSection === item.id
                  ? 'text-white bg-[rgba(77,199,232,1)]'
                  : 'text-sky-900 hover:text-white hover:bg-sky-500/20'
                }
              `}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Mobile Navbar with Horizontal Overflow */}
        <div className="lg:hidden flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-white/90 via-sky-50/80 to-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-x-auto scrollbar-thin scrollbar-thumb-sky-300 scrollbar-track-sky-100">
          {NavbarItem.map((item) => (
            <button
              key={item.id}
              onClick={() => handleScroll(item.id)}
              className={`
                whitespace-nowrap px-3 py-2 text-xs font-medium transition-all duration-300 rounded-full flex-shrink-0
                ${activeSection === item.id
                  ? 'text-white bg-sky-600 shadow-md'
                  : 'text-sky-900 hover:text-white hover:bg-sky-500/20'
                }
              `}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubNavbar;