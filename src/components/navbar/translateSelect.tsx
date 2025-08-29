import { useState, useEffect } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import i18n from 'i18next';
import enFlag from '/flag/engg.jpg';
import ruFlag from '/flag/rus.png';
import uzFlag from '/flag/uzb.png'; // O‘zbek bayrog‘i uchun to‘g‘ri rasm

const languages = [
  { code: 'en', label: 'EN', photo: enFlag },
  { code: 'uz', label: 'UZB', photo: uzFlag },
  { code: 'ru', label: 'Рус', photo: ruFlag },
];

const LanguageSelector: React.FC = () => {
  const currentLangCode = i18n.language.split('-')[0];
  const [selectedLang, setSelectedLang] = useState(currentLangCode || 'en');

  // Til o‘zgarganda i18n va localStorage’ni yangilash
  useEffect(() => {
    i18n.changeLanguage(selectedLang);
    document.documentElement.lang = selectedLang;
    localStorage.setItem('lang', selectedLang);
  }, [selectedLang]);

  // Tilni o‘zgartirish funksiyasi
  const handleLangChange = (langCode: string) => {
    if (langCode !== selectedLang) {
      setSelectedLang(langCode);
      localStorage.setItem('lang', langCode);
      i18n.changeLanguage(langCode);
      document.documentElement.lang = langCode;
      window.location.reload(); // Sahifani yangilash
    }
  };

  return (
    <div className="relative cursor-pointer inline-block z-50">
      <Menu>
        <Menu.Button className="inline-flex items-center px-2 py-1.5 border border-white  text-white transition-all">
          <img
            src={languages.find((l) => l.code === selectedLang)?.photo}
            alt={selectedLang}
            className="w-6 h-4 object-cover rounded-sm"
          />
          <ChevronDownIcon className="ml-1 h-4 w-4 text-white" />
        </Menu.Button>

        <Menu.Items className="absolute right-0 mt-2 w-24 bg-white  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[9999]">
          <div className="py-1">
            {languages.map((lang) => (
              <Menu.Item key={lang.code}>
                {({ active }) => (
                  <button
                    onClick={() => handleLangChange(lang.code)}
                    className={`${
                      active ? 'bg-gray-100' : 'bg-white'
                    }  w-full text-left px-2 py-1.5 text-sm flex items-center justify-center`}
                  >
                    <img
                      src={lang.photo}
                      alt={lang.label}
                      className="w-8 h-5 object-cover rounded-sm"
                    />
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default LanguageSelector;