"use client";

import React, { useEffect, useRef, useState } from "react";

interface Brand {
  file?: string;
  name?: string;
}

interface PartnersSliderProps {
  brands?: Brand[];
}

const PartnersSlider: React.FC<PartnersSliderProps> = ({ brands }) => {
  const defaultBrands: Brand[] = [
    { file: "/images/place1.png", name: "Default 1" },
    { file: "/images/place3.png", name: "Default 2" },
    { file: "/images/place1.png", name: "Default 3" },
    { file: "/images/place1.png", name: "Default 1" },
    { file: "/images/place3.png", name: "Default 2" },
    { file: "/images/place1.png", name: "Default 3" },

    { file: "/images/place1.png", name: "Default 3" },
    { file: "/images/place1.png", name: "Default 1" },
    { file: "/images/place3.png", name: "Default 2" },
    { file: "/images/place1.png", name: "Default 3" },
  ];

  const allBrands = brands && brands.length > 0 ? brands : defaultBrands;

  const [scrollX, setScrollX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let requestId: number;
    const speed = 0.5; // px per frame

    const animate = () => {
      setScrollX((prev) => {
        const maxScroll = container.scrollWidth / 2; // because we duplicate
        return prev >= maxScroll ? 0 : prev + speed;
      });
      requestId = requestAnimationFrame(animate);
    };
    requestId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestId);
  }, []);

  // Duplicate brands for infinite scroll
  const duplicatedBrands = [...allBrands, ...allBrands];

  return (
    <div className="w-full max-w-7xl mx-auto mt-1 sm:mt-2 md:mt-1 bg-gradient-to-l min-h-[80px] sm:min-h-[100px] md:min-h-[130px] lg:min-h-[160px] flex items-center  rounded-lg p-5 sm:p-4 md:p-5 overflow-hidden">
      <div
        ref={containerRef}
        className="flex gap-6 whitespace-nowrap"
        style={{ transform: `translateX(-${scrollX}px)` }}
      >
        {duplicatedBrands.map((brand, i) => (
          <div
            key={i}
            className="flex-none w-45 h-45 flex items-center justify-center "
          >
            <img
              src={brand.file}
              alt={brand.name}
              width={300}
              height={300}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersSlider;
