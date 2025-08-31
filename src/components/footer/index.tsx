import { Facebook, Instagram, MessageCircleDashedIcon, Twitter } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useGetDashboardListQuery } from '@/services/api';

// Interfeyslar
interface MultilangText {
  uz: string;
  en: string;
  ru: string;
}


// Statik navigatsiya linklari (API bilan birlashtirish uchun)
const staticNavigationLinks = [
  { id: 9, key: 'home', link: '/', titleEn: 'Home' },
  { id: 1, key: 'services.hotels', link: '/hotels', titleEn: 'Hotels' },
  { id: 2, key: 'services.resort', link: '/services/resort', titleEn: 'Resort' },
  { id: 3, key: 'services.tour-firm', link: '/services/tours', titleEn: 'Tour Companies' },
  { id: 4, key: 'services.banks', link: '/services/banks', titleEn: 'Banks' },
  { id: 5, key: 'services.clinic', link: '/services/clinics', titleEn: 'Medical Clinics' },
  { id: 6, key: 'services.market', link: '/services/market', titleEn: 'Market' },
  { id: 7, key: 'services.airplane', link: '/services/airplanes', titleEn: 'Helicopters' },
  { id: 8, key: 'services.tourbus', link: '/services/tour-bus', titleEn: 'Transport Services' },
];

// Social media data
const socialMedia = [
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
  { href: 'https://linkedin.com', icon: MessageCircleDashedIcon, label: 'LinkedIn' },
];

// Company and developer info
const companyInfo = {
  name: 'Tourism Uzbekistan',
  logo: '/logo-light.png',
  developer: 'WebDev Solutions',
  developerWebsite: 'https://webdevsolutions.uz',
};

// Company logo and info section
const CompanySection: React.FC = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      <div className="relative z-10 text-center py-8 border-t-2 border-white/20">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="w-full h-full transform flex items-center justify-center">
              <img
                src={companyInfo.logo}
                alt={`${companyInfo.name} logo`}
                className="h-15 w-auto"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-wide">
            <span className="bg-gradient-to-r text-white bg-clip-text">
              {companyInfo.name}
            </span>
          </h2>
        </div>
        <div className="max-w-lg mx-auto mb-8">
          <p className="text-white/90 text-lg leading-relaxed font-light">
            {t('footer.companyDescription') || "O'zbekistondagi eng yaxshi turizm xizmatlarini taqdim etuvchi kompaniya"}
          </p>
        </div>
        <div className="inline-flex items-center space-x-3 bg-black/20 backdrop-blur-sm px-6 py-3 border border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>
            <span className="text-white/70 text-sm">Made with</span>
            <span className="text-white/70 text-sm">by</span>
          </div>
          <a
            href="https://ictacademy.uz/uz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105 border-b border-yellow-400/50 hover:border-yellow-300 pb-1"
          >
            ICT Academy
          </a>
        </div>
      </div>
    </section>
  );
});

// Navigation section
const NavigationSection: React.FC = memo(() => {
  const { t, i18n } = useTranslation();
  const { data: apiNavigationLinks, isLoading, isError } = useGetDashboardListQuery();

  // Joriy tilni aniqlash
  const currentLanguage = i18n.language as keyof MultilangText;

  // API va statik ma'lumotlarni birlashtirish
  const formattedNavigationLinks = apiNavigationLinks
    ?.map((apiLink) => {
      const staticLink = staticNavigationLinks.find(
        (s) => s.id === apiLink.id || s.titleEn.toLowerCase() === (apiLink.title.en ?? '').toLowerCase()
      );
      return {
        id: apiLink.id,
        key: staticLink?.key || 'services.default',
        link: staticLink?.link || '/services/default',
        title: apiLink.title,
        is_active: apiLink.is_active ?? false,
      };
    })
    .filter(
      (link) =>
        link.title &&
        Object.values(link.title).some((t) => t?.trim() !== '') &&
        link.is_active
    ) || [];

  if (isLoading) {
    return (
      <div className="flex-1 min-w-[200px] text-center">
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (isError || !apiNavigationLinks || formattedNavigationLinks.length === 0) {
    return (
      <div className="flex-1 min-w-[200px] text-center text-red-500">
        <p>{t('error')}</p>
      </div>
    );
  }

  return (
    <nav className="flex-1 min-w-[200px]" aria-label="Footer navigation">
      <h3 className="text-lg font-semibold mb-4">{t('footer.pagesTitle')}</h3>
      <ul className="space-y-2" role="list">
        {formattedNavigationLinks.map(({ link, title, id }) => (
          <li key={id}>
            <Link
              to={link}
              className="hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              {title[currentLanguage] || title.en}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
});

// Contact section
const ContactSection: React.FC = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="flex-1 min-w-[200px]">
      <h3 className="text-lg font-semibold mb-4">{t('footer.contactTitle')}</h3>
      <address className="space-y-2 not-italic">
        <div>
          {t('footer.contactEmail')}:{' '}
          <a
            className="hover:text-gray-200 transition-colors duration-200 ml-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            href="mailto:tourism@gmail.com"
          >
            tourism@gmail.com
          </a>
        </div>
        <div>
          {t('footer.contactPhone')}:{' '}
          <a
            className="hover:text-gray-200 transition-colors duration-200 ml-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            href="tel:+998774800012"
          >
            +998 77 480 00 12
          </a>
        </div>
        <div>
          {t('footer.contactAddress')}: {t('about.add')}
        </div>
      </address>
    </section>
  );
});

// Social media section
const SocialMediaSection: React.FC = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="flex md:items-center flex-col min-w-[200px]">
      <h3 className="text-lg font-semibold mb-4">{t('footer.socialTitle')}</h3>
      <div className="flex gap-4 md:justify-center" role="list">
        {socialMedia.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            className="text-2xl hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 p-1"
            aria-label={`${label} sahifamizga tashrif buyuring`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon />
          </a>
        ))}
      </div>
    </section>
  );
});

// Main Footer component
const Footer: React.FC = memo(() => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[rgba(25,110,150,0.95)] text-white py-10 px-5" role="contentinfo">
      <div className="max-w-6xl md:mx-auto">
        <div className="flex flex-wrap justify-between gap-8 mb-8">
          <NavigationSection />
          <ContactSection />
          <SocialMediaSection />
        </div>
        <CompanySection />
        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-sm">
            {t('footer.rights') || `© ${new Date().getFullYear()} Barcha huquqlar himoyalangan.`}
          </p>
        </div>
      </div>
    </footer>
  );
});

CompanySection.displayName = 'CompanySection';
NavigationSection.displayName = 'NavigationSection';
ContactSection.displayName = 'ContactSection';
SocialMediaSection.displayName = 'SocialMediaSection';
Footer.displayName = 'Footer';

export default Footer;