import { useState, useEffect } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import i18n from 'i18next';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'uz', label: 'UZB' },
  { code: 'ru', label: 'Рус' },
];

const LanguageSelector = () => {
  const currentLangCode = i18n.language.split('-')[0];
  const [selectedLang, setSelectedLang] = useState(currentLangCode || 'en');

  useEffect(() => {
    i18n.changeLanguage(selectedLang);
    document.documentElement.lang = selectedLang;
    localStorage.setItem('lang', selectedLang);
  }, [selectedLang]);

  const handleLangChange = (langCode: string) => {
    window.location.reload();
    if (langCode !== selectedLang) {
      setSelectedLang(langCode);
      localStorage.setItem('lang', langCode);
      i18n.changeLanguage(langCode);
      document.documentElement.lang = langCode;
    }
  };

  return (
    <div className="relative cursor-pointer inline-block z-50">
      <Menu>
        <Menu.Button className="inline-flex items-center px-3 py-1.5 border border-white text-white rounded-md text-sm hover:bg-white hover:text-black transition-all">
          {languages.find((l) => l.code === selectedLang)?.label}
          <ChevronDownIcon className="ml-1 h-4 w-4" />
        </Menu.Button>

        <Menu.Items
          className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[9999]"
        >
          <div className="py-1">
            {languages.map((lang) => (
              <Menu.Item key={lang.code}>
                {({ active }) => (
                  <button
                    onClick={() => handleLangChange(lang.code)}
                    className={`${active ? 'bg-gray-100 text-blue-600' : 'text-gray-800'
                      } block w-full text-left px-4 py-2 text-sm`}
                  >
                    {lang.label}
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
