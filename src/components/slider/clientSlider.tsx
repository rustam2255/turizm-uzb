import React, { useEffect, useState } from "react";

// @ts-expect-ignore
import Slider from "react-slick";
import type { Settings } from "react-slick";

interface Props {
  settings: Settings;
  children: React.ReactNode;
}

const ClientSlider: React.FC<Props> = ({ settings, children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <Slider {...settings}>{children}</Slider>;
};

export default ClientSlider;
