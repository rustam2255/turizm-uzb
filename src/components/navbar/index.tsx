import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from "@/assets/images/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSelector from './translateSelect';

import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const NavbarItem = [
    { id: 1, title: t("navbar.home"), link: "/" },
    { id: 2, title: t("navbar.media"), link: "/media/news" },
    { id: 3, title: t("navbar.magazines"), link: "/magazines" },
    { id: 8, title: t("navbar.services"), link: "/services" },
    { id: 6, title: t("navbar.documents"), link: "/documents" },
    { id: 7, title: t("navbar.maps"), link: "/maps" },
  ];
  
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
        setLastScrollY(currentScrollY);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setShowNavbar(true);
    }
  }, [lastScrollY, location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Navbar uchun joy */}
      <div className="h-16 sm:h-[10vh]"></div>

      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full h-16 sm:h-[10vh] z-[9999] transition-all duration-300 shadow-lg flex justify-between items-center ${
          showNavbar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{
          background: 'rgba(25, 110, 150, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(135, 206, 250, 0.3)',
        }}
      >
        {/* Dekorativ yuqori chegara */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-sky-300 via-sky-400 to-sky-300 opacity-60"></div>

        <div className="px-4 sm:px-6 md:px-8 lg:px-16 w-full flex items-center justify-between h-full  mx-auto">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center flex-shrink-0 transition-all duration-200 z-[10001]"
            onClick={closeMobileMenu}
          >
            <img
              src={Logo}
              alt="Logotip"
              className="w-auto h-auto max-h-[24px] sm:max-h-[30px] md:max-h-[35px] lg:max-h-[40px]"
              loading="lazy"
              
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex justify-center items-center max-w-4xl mx-4">
            <ul className="flex space-x-4 xl:space-x-8 text-[14px] xl:text-[15px] font-medium items-center">
              {NavbarItem.map((item) => (
                <li key={item.id} className="relative group">
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      `py-2 px-4 block text-white relative whitespace-nowrap
                       hover:text-sky-100 transition-all duration-200 rounded-md
                       hover:bg-white/10 hover:shadow-sm
                       ${isActive ?
                        'after:absolute after:left-0 after:right-0 after:bottom-[-10px] after:h-[2px] after:bg-white after:rounded-full after:shadow-sm bg-white/15' :
                        ''
                      }`
                    }
                    style={{
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                    }}
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-x-2 sm:gap-x-3">
            {/* Language Selector */}
            <div className="z-[10001] relative cursor-pointer drop-shadow-sm">
              <LanguageSelector />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="block lg:hidden text-white focus:outline-none hover:bg-white/10 p-2 sm:p-3 rounded-md transition-all duration-200 z-[10001] focus:ring-2 focus:ring-sky-300"
              aria-label={isMobileMenuOpen ? "Menyuni yopish" : "Menyuni ochish"}
              aria-expanded={isMobileMenuOpen}
            >
              <div className="space-y-1.5">
                <div
                  className={`w-5 sm:w-6 h-0.5 bg-white transition-transform origin-center duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                  style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}
                />
                <div
                  className={`w-5 sm:w-6 h-0.5 bg-white transition-opacity duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}
                />
                <div
                  className={`w-5 sm:w-6 h-0.5 bg-white transition-transform origin-center duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                  style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}
                />
              </div>
            </button>

            
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-[10000] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              className="fixed top-0 left-0 w-full h-full z-[10000] lg:hidden flex flex-col"
              style={{
                background: 'linear-gradient(180deg, rgba(25, 110, 150, 0.98) 0%, rgba(56, 178, 237, 0.95) 50%, rgba(79, 172, 254, 0.92) 100%)',
                backdropFilter: 'blur(12px)',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Mobile Menu Header Space */}
              <div className="h-16 sm:h-[10vh] flex-shrink-0"></div>

              {/* Mobile Menu Content */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
                <div className="max-w-sm mx-auto space-y-3 sm:space-y-4">
                  {NavbarItem.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="w-full"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <div className="border border-white/20 bg-white/5 backdrop-blur-md w-full rounded-lg hover:bg-white/10 hover:border-white/30 transition-all duration-200 shadow-sm">
                        <NavLink
                          to={item.link}
                          onClick={closeMobileMenu}
                          className={({ isActive }) =>
                            `block py-4 px-6 text-white text-base sm:text-lg font-medium w-full text-left hover:text-sky-100 transition-colors duration-200 focus:ring-2 focus:ring-sky-300 rounded-lg ${
                              isActive ? 'bg-white/10 text-sky-100' : ''
                            }`
                          }
                          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
                        >
                          {item.title}
                        </NavLink>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Menu Footer */}
                <motion.div
                  className="mt-8 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: NavbarItem.length * 0.1 + 0.2, duration: 0.3 }}
                >
                  <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
                </motion.div>
              </div>

              {/* Safe area for mobile devices */}
              <div className="h-safe-area-inset-bottom flex-shrink-0"></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;