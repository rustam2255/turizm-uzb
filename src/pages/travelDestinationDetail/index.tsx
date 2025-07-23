import React, { useState } from "react";
import { useParams } from "react-router-dom";
import TravelPlaceDetail from "./travelDetail";
import { useGetPlaceByIdQuery } from "@/services/api";
import IMAGE from "@assets/images/samarkand-img.png";
import IMAGE1 from "@assets/images/place1.png";
import IMAGE2 from "@assets/images/place3.png"



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
    <div className="px-4 pt-[79px]">
      <TravelPlaceDetail place={place} nextImage={nextImage} prevImage={prevImage} currentImageIndex={currentImageIndex} images={images} setCurrentImageIndex={setCurrentImageIndex} />
    </div>
  );
};

export default TravelDetailPage;
