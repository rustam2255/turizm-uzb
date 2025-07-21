
import React from "react";

const HotelCardSkeleton: React.FC = () => (
  <div className="animate-pulse flex flex-row md:flex-col gap-4 md:gap-0 w-full">
    <div className="bg-gray-300 rounded w-[330px] h-[115px] md:w-full md:h-[220px] md:mb-6 " />
    <div className="flex flex-col w-full gap-3">
      <div className="h-5 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-full" />
    </div>
  </div>
);

export default HotelCardSkeleton; 
