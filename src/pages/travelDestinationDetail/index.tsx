import React, { useState } from "react";
import { useParams } from "react-router-dom";
import TravelPlaceDetail from "./travelDetail";
import { useGetPlaceByIdQuery } from "@/services/api";
import IMAGE from "@assets/images/samarkand-img.png";
import IMAGE1 from "@assets/images/place1.png";
import IMAGE2 from "@assets/images/place3.png"

import { Helmet } from "react-helmet-async";

const TravelDetailPage: React.FC = () => {
  const { idSlug } = useParams<{ idSlug: string }>();


  const tourId = Number(idSlug?.split("-")[0]);
  const { data: place, isLoading, isError } = useGetPlaceByIdQuery(tourId!, {
    skip: !tourId,
  });

  const mockImage = [
    IMAGE, IMAGE1, IMAGE2
  ]
  const images =
    place?.images?.length && place.images[0].photo
      ? place.images
      : mockImage.map((img, index) => ({ id: index, photo: img }));
  console.log(images);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  if (isLoading) {
    return <div className="text-center py-10">Yuklanmoqda...</div>;
  }

  if (isError || !place) {
    return <div className="text-center py-10 text-red-500">Ma’lumot topilmadi</div>;
  }

  return (
    <div className="px-4">
      <Helmet>
        <title>{place.name || "Travel Place"} | Uzbekistan Tours</title>
        <meta
          name="description"
          content={ "Uzbekistan travel companies"}
        />
        <meta name="keywords" content={`travel, tour, Uzbekistan, ${place.name}`} />
        <link rel="canonical" href={window.location.href} />

        {/* Open Graph */}
        <meta property="og:title" content={`${place.name} | Uzbekistan Tours`} />
        <meta property="og:description" content={"Uzbekistan trave companies"} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={images[0]?.photo || IMAGE} />
      </Helmet>
      <TravelPlaceDetail place={place} nextImage={nextImage} prevImage={prevImage} currentImageIndex={currentImageIndex} images={images} setCurrentImageIndex={setCurrentImageIndex} />
    </div>
  );
};

export default TravelDetailPage;
