import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from "@/assets/images/logo.png";
import SearchIcon from "@assets/icons/Search1.svg";
import { motion } from "framer-motion";
// import VectorSelect from "@assets/icons/vector-select-white.svg"
import LanguageSelector from './translateSelect';
import { useTranslation } from 'react-i18next';

const NavbarHome: React.FC = () => {
  const { t } = useTranslation();
  const NavbarItem = [
    { id: 1, title: t("navbar.home"), link: "/" },
    { id: 2, title: t("navbar.media"), link: "/media/news" },
    { id: 3, title: t("navbar.magazines"), link: "/magazines" },
    { id: 6, title: t("navbar.documents"), link: "/documents" },
    { id: 7, title: t("navbar.maps"), link: "/maps" },
    { id: 8, title: t("navbar.services"), link: "/services" }
  ];
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [hoveredDropdown, setHoveredDropdown] = useState<number | null>(null);
  // const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  // const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 1000) {
        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY) {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // const handleMouseEnter = (id: number) => {
  //   if (dropdownTimeout) clearTimeout(dropdownTimeout);
  //   setHoveredDropdown(id);
  // };

  // const handleMouseLeave = () => {
  //   const timeout = setTimeout(() => setHoveredDropdown(null), 200);
  //   setDropdownTimeout(timeout);
  // };

  return (
    <nav
      className="absolute top-0 left-0 w-full z-50 bg-transparent  transition-all duration-300"
      style={{
        transform: showNavbar ? 'translateY(0)' : 'translateY(-100%)',
        opacity: showNavbar ? 1 : 0,
      }}
    >
      <div className="px-4 py-3 sm:px-6 sm:py-4 md:px-[80px] md:py-[20px] flex items-center justify-between">
        <Link to="/" className="flex items-center flex-shrink-0">
        <img src={Logo} alt="Logo" className='w-20 h-12 sm:w-24 sm:h-14 md:w-32 md:h-16 rounded-xl' />
          
        </Link>

        <div className="hidden lg:flex flex-1 justify-center max-w-4xl mx-4">
          <ul className="flex space-x-4 xl:space-x-[40px] text-[14px] xl:text-[15px] font-normal">
            {NavbarItem.map((item) => (
              <li
                key={item.id}
                className="relative group"
              // onMouseEnter={() => handleMouseEnter(item.id)}
              // onMouseLeave={handleMouseLeave}
              >
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    `py-2 px-2 xl:px-3 block text-white relative whitespace-nowrap ${isActive ? 'after:absolute after:left-0 after:right-0 after:bottom-[-20px] after:h-[2px] after:bg-white' : ''
                    }`
                  }
                >
                  {item.title}
                </NavLink>

                {/* {item.children1 && item.children2 && hoveredDropdown === item.id && (
                  <div className="absolute left-1/2 top-full bg-white shadow-md z-50 w-[970px] transform -translate-x-1/2 flex gap-[140px] p-6 mt-5">
                    <div className='flex flex-col items-start gap-[20px]'>
                      <h4 className="font-normal text-[16px] text-[#DE5D26]">{item.title1}</h4>
                      {item.children1.map((child) => (
                        <NavLink
                          key={child.id}
                          to={child.link}
                          className="block text-[16px] text-black hover:underline"
                        >
                          {child.title}
                        </NavLink>
                      ))}
                    </div>
                    <div className='flex flex-col items-start gap-[20px]'>
                      <h4 className="font-semibold text-[#212121] text-[15px] tracking-[4%] uppercase">{item.title2}</h4>
                      {item.children2.map((child) => (
                        <NavLink
                          key={child.id}
                          to={child.link}
                          className="block text-[16px] text-black hover:underline"
                        >
                          {child.title}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )} */}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-x-3 sm:gap-x-4 md:gap-x-5">
          <div className="z-[9999] relative order-2 md:order-1">
            <LanguageSelector />
          </div>

          <button
            onClick={toggleMobileMenu}
            className="block lg:hidden text-white focus:outline-none order-1 md:order-2"
          >
            <div className="space-y-1.5">
              <div className={`w-5 sm:w-6 h-0.5 bg-white transition-transform origin-top-left duration-300 ${isMobileMenuOpen ? 'rotate-45' : ''}`} />
              <div className={`w-5 sm:w-6 h-0.5 bg-white transition-transform origin-bottom-left duration-300 ${isMobileMenuOpen ? '-rotate-45 translate-y-2' : ''}`} />
              <div className={`w-5 sm:w-6 h-0.5 bg-white transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            </div>
          </button>

          <button className="h-5 w-5 sm:h-6 sm:w-6 hidden md:block order-3">
            <img src={SearchIcon} alt="Search icon" className="w-full h-full" />
          </button>
        </div>
      </div>

      <motion.div
        className={`z-[9999] lg:hidden flex flex-col items-center w-full transition-all duration-300 ${isMobileMenuOpen
          ? 'h-screen backdrop-blur-md bg-[#242424]/95 pt-6 sm:pt-10 px-4 overflow-auto'
          : 'h-0 overflow-hidden'
          }`}
        initial={false}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
      >
        {NavbarItem.map((item) => (
          <div key={item.id} className="w-full text-left mb-4 sm:mb-6 max-w-md">
            <div className="flex flex-col items-start w-full">
              <div className="border border-gray-500 w-full rounded-lg px-3 py-1">
                {/* {!item.children1 && !item.children2 ? ( */}
                <NavLink
                  to={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-white text-sm sm:text-base font-semibold w-full text-left"
                >
                  {item.title}
                </NavLink>
                {/* ) */}
                {/* : (
                  <button onClick={() =>
                    setOpenDropdownId(openDropdownId === item.id ? null : item.id)
                  }
                    className='flex flex-row gap-32 items-center justify-between' >
                    <p className="block py-2 text-white text-base font-semibold w-full text-left" >
                      {item.title}
                    </p>
                    <span
                      className={`transform text-white transition-transform duration-300 ${openDropdownId === item.id ? "rotate-180" : "rotate-0"
                        }`}
                    >
                      <img className="h-3" src={VectorSelect} alt="selected icon" />
                    </span>
                  </button>
                ) */}
                {/* } */}
              </div>
            </div>

            {/* {item.children1 && item.children2 && openDropdownId === item.id && (
              <div className="pl-4 space-y-2 mt-2">
                <h4 className="text-white font-semibold">{item.title1}</h4>
                {item.children1.map((child) => (
                  <NavLink
                    key={child.id}
                    to={child.link}
                    className="block underline text-white text-sm pl-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {child.title}
                  </NavLink>
                ))}
                <h4 className="text-white font-semibold mt-4">{item.title2}</h4>
                {item.children2.map((child) => (
                  <Link
                    key={child.id}
                    to={child.link}
                    className="block underline text-white text-sm pl-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            )} */}
          </div>
        ))}
      </motion.div>
    </nav>
  );
};

export default NavbarHome;