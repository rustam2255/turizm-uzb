import React from "react";

const MagazineSkeleton: React.FC = () => {
  return (
    <div className="flex px-[70px] md:px-0 flex-col items-start sm:items-center md:items-center">
      <div className="flex flex-col items-center animate-pulse">
        <div className="w-full h-[300px] md:w-[200px] md:h-[250px] sm:w-[160px] sm:h-[200px] bg-gray-200 rounded-md mb-4" />
        <div className="text-center space-y-2">
          <div className="w-16 h-4 bg-gray-200 rounded mx-auto" />
          <div className="w-20 h-4 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default MagazineSkeleton;
