import { Facebook, Instagram, MessageCircleDashedIcon, Twitter } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';


// Navigation links data
const navigationLinks = [
  { href: '/', key: 'home' },
  { href: '/services/tours', key: 'tours' },
  { href: '/hotels', key: 'hotels' },
  { href: '/services/resort', key: 'resorts' },
  { href: '/services/market', key: 'shops' },
  { href: '/magazines', key: 'magazines' },
  { href: '/services/tour-bus', key: 'tourbus' },
  { href: '/services/airplanes', key: 'airplane' }
];

// Social media data
const socialMedia = [
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
  { href: 'https://linkedin.com', icon: MessageCircleDashedIcon, label: 'LinkedIn' },
];

// Contact info
const contactInfo = {
  email: 'info@tourismwebsite.uz',
  phone: '+998901234567',
  address: "Toshkent sh., Amir Temur ko'chasi, 123",
};

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


      {/* Main content container */}
      <div className="relative z-10 text-center py-8 border-t-2 border-white/20">
        {/* Logo and company name */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            {/* Hexagon shape around logo */}

            <div className="w-full h-full transform   flex items-center justify-center">
              <img
                src={companyInfo.logo}
                alt={`${companyInfo.name} logo`}
                className="h-15 w-auto "
                loading='lazy'
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

          </div>

          {/* Company name with special styling */}
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-wide">
            <span className="bg-gradient-to-r text-white bg-clip-text">
              {companyInfo.name}
            </span>
          </h2>
        </div>
        <div className="max-w-lg mx-auto mb-8">
          <p className="text-white/90 text-lg leading-relaxed font-light">

            {t('footer.companyDescription') || "O'zbekistondagi eng yaxshi turizm xizmatlarini taqdim etuvchi kompaniya"}{' '}

          </p>
        </div>

        {/* Developer credit */}
        <div className="inline-flex items-center space-x-3 bg-black/20 backdrop-blur-sm  px-6 py-3 border border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3  bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>
            <span className="text-white/70 text-sm">Made with</span>
            <span className="text-white/70 text-sm">by</span>
          </div>
          <a
            href='https://ictacademy.uz/uz/'
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
  const { t } = useTranslation();

  return (
    <nav className="flex-1 min-w-[200px]" aria-label="Footer navigation">
      <h3 className="text-lg font-semibold mb-4">{t('footer.pagesTitle')}</h3>
      <ul className="space-y-2" role="list">
        {navigationLinks.map(({ href, key }) => (
          <li key={key}>
            <a
              href={href}
              className="hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              {t(`footer.pages.${key}`)}
            </a>
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
            href={`mailto:${contactInfo.email}`}
            className="hover:text-gray-200 transition-colors duration-200 ml-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 "
          >
            {contactInfo.email}
          </a>
        </div>
        <div>
          {t('footer.contactPhone')}:{' '}
          <a
            href={`tel:${contactInfo.phone}`}
            className="hover:text-gray-200 transition-colors duration-200 ml-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 "
          >
            {contactInfo.phone}
          </a>
        </div>
        <div>
          {t('footer.contactAddress')}: {contactInfo.address}
        </div>
      </address>
    </section>
  );
});

// Social media section
const SocialMediaSection: React.FC = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="flex items-center flex-col min-w-[200px]">
      <h3 className="text-lg font-semibold mb-4">{t('footer.socialTitle')}</h3>
      <div className="flex gap-4 justify-center" role="list">
        {socialMedia.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            className="text-2xl hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600  p-1"
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
      <div className="max-w-6xl mx-auto">
        {/* Main footer content */}
        <div className="flex flex-wrap justify-between gap-8 mb-8">
          <NavigationSection />
          <ContactSection />
          <SocialMediaSection />
        </div>

        {/* Company logo and info section */}
        <CompanySection />

        {/* Footer bottom */}
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