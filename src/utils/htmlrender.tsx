import React, { useRef, useEffect } from 'react';

interface HtmlRendererProps {
  html: string;
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ html }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Shadow root yaratish (agar hali bo'lmasa)
      let shadow = containerRef.current.shadowRoot;
      if (!shadow) {
        shadow = containerRef.current.attachShadow({ mode: 'open' });
      }

      // Shadow DOM ichiga bazadan kelgan HTML va style qo‘yish
      shadow.innerHTML = html;
    }
  }, [html]);

  return <div ref={containerRef}></div>;
};

export default HtmlRenderer;
