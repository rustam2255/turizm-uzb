import React, { useEffect } from 'react';

const Logo: React.FC = () => {
  useEffect(() => {
    const id = 'google-font-inspiration';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.href =
        'https://fonts.googleapis.com/css2?family=Inspiration&family=Pacifico&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  const handleCopy = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className="text-[32px] leading-[100%] tracking-normal text-white select-none"
      style={{ fontFamily: "'Inspiration', cursive" }}
      onCopy={handleCopy}
      translate="no"
    >
      TurizmUzbekistan
    </div>
  );
};

export default Logo;
