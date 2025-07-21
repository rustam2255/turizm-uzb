import { useTranslation } from "react-i18next";

type SectionId = "home" | "media" | "hotelCard" | "detanation";

interface SubNavbarProps {
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
}

const SubNavbar: React.FC<SubNavbarProps> = ({ activeSection, setActiveSection }) => {
  const { t } = useTranslation();
  
  const NavbarItem = [
    { id: 'home' as SectionId, title: t("subNavbar.home"), link: "/" },
    { id: 'media' as SectionId, title: t("subNavbar.media"), link: "/article" },
    { id: 'hotelCard' as SectionId, title: t("navbar.hotels"), link: "/magazines" },
    { id: 'detanation' as SectionId, title: t("navbar.travelDestination"), link: "/documents" },
  ];

  const handleScroll = (id: SectionId) => {
    const section = document.getElementById(id);
    if (section) {
      const headerOffset = 120; // Adjust this value based on your sticky header height
      const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      setActiveSection(id);
    }
  };

  return (
    <div className="w-full py-4">
      <div className="flex justify-center items-center rounded-full p-1 bg-white/80  backdrop-blur-sm shadow-lg mx-auto max-w-fit">
        <div className="flex items-center justify-center gap-0 px-2 py-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {NavbarItem.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleScroll(item.id)}
              className={`
                relative px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium 
                transition-all duration-300 hover:cursor-pointer
                min-w-fit flex-shrink-0 rounded-full
                ${activeSection === item.id
                  ? 'text-white bg-black/80 shadow-md'
                  : 'text-black hover:text-white hover:bg-white/10'
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