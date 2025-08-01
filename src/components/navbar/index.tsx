import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from "@/assets/images/logo.png";
import SearchIcon from "@assets/icons/Search1.svg";
import { motion } from "framer-motion";
import LanguageSelector from './translateSelect';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
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
        if (currentScrollY > lastScrollY) {
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
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Placeholder for navbar height */}
      <div style={{ height: '11vh' }}></div>
      
      <nav
        className="fixed top-0 h-[11vh] left-0 w-full z-[9999] transition-all duration-300 shadow-lg flex items-center"
        style={{
          background: 'rgba(77,199,232,255)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(135, 206, 250, 0.3)',
          transform: showNavbar ? 'translateY(0)' : 'translateY(-100%)',
          opacity: showNavbar ? 1 : 0,
        }}
      >
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-sky-300 via-sky-400 to-sky-300 opacity-60"></div>

        <div className="px-4 sm:px-6 md:px-[80px] w-full flex items-center justify-between h-full">
          <Link to="/" className="flex items-center flex-shrink-0 transition-all duration-200">
            <img
              src={Logo}
              alt="Logo"
              className="w-auto h-auto max-h-[50px] sm:max-h-[60px] md:max-h-[50px]"
              loading="eager"
            />
          </Link>

          <div className="hidden lg:flex  justify-center items-center max-w-4xl mx-4">
            <ul className="flex space-x-4 xl:space-x-[40px] text-[14px] xl:text-[15px] font-medium items-center">
              {NavbarItem.map((item) => (
                <li key={item.id} className="relative group">
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      `py-1 px-3 xl:px-2 block text-white relative whitespace-nowrap
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

          <div className="flex items-center gap-x-3 sm:gap-x-4 md:gap-x-5">
            <div className="z-[9999] relative order-2 md:order-1 drop-shadow-sm">
              <LanguageSelector />
            </div>

            <button
              onClick={toggleMobileMenu}
              className="block lg:hidden text-white focus:outline-none order-1 md:order-2
                         hover:bg-white/10 p-2 rounded-md transition-all duration-200"
            >
              <div className="space-y-1.5">
                <div
                  className={`w-5 sm:w-6 h-0.5 bg-white transition-transform origin-top-left duration-300
                             ${isMobileMenuOpen ? 'rotate-45' : ''}`}
                  style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}
                />
                <div
                  className={`w-5 sm:w-6 h-0.5 bg-white transition-transform origin-bottom-left duration-300
                             ${isMobileMenuOpen ? '-rotate-45 translate-y-2' : ''}`}
                  style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}
                />
                <div
                  className={`w-5 sm:w-6 h-0.5 bg-white transition-opacity duration-300
                             ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                  style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))' }}
                />
              </div>
            </button>

            <button className="h-5 w-5 sm:h-6 sm:w-6 hidden md:block order-3
                             hover:bg-white/10 p-1 rounded-md transition-all duration-200">
              <img
                src={SearchIcon}
                alt="Search icon"
                className="w-full h-full drop-shadow-sm"
                loading="eager"
              />
            </button>
          </div>
        </div>

        <motion.div
          className={`z-[9999] lg:hidden flex flex-col items-center w-full transition-all duration-300 ${
            isMobileMenuOpen
              ? 'h-screen pt-6 sm:pt-10 px-4 overflow-auto'
              : 'h-0 overflow-hidden'
          }`}
          style={{
            background: isMobileMenuOpen ?
              'linear-gradient(180deg, rgba(14, 116, 188, 0.98) 0%, rgba(56, 178, 237, 0.95) 50%, rgba(79, 172, 254, 0.92) 100%)' :
              'transparent',
            backdropFilter: isMobileMenuOpen ? 'blur(15px)' : 'none'
          }}
          initial={false}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
        >
          {NavbarItem.map((item) => (
            <div key={item.id} className="w-full text-left mb-4 sm:mb-6 max-w-md">
              <div className="flex flex-col items-start w-full">
                <div className="border border-white/30 bg-white/10 backdrop-blur-sm w-full rounded-xl px-4 py-2
                              hover:bg-white/15 hover:border-white/40 transition-all duration-200 shadow-sm">
                  <NavLink
                    to={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-white text-sm sm:text-base font-semibold w-full text-left
                             hover:text-sky-100 transition-colors duration-200"
                    style={{
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                    }}
                  >
                    {item.title}
                  </NavLink>
                </div>
              </div>
            </div>
          ))}

          {/* Mobile menu decorative element */}
          <div className="mt-8 w-24 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
        </motion.div>
      </nav>
    </>
  );
};

export default Navbar;