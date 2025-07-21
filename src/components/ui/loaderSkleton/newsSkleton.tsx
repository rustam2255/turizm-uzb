// @/components/ui/NewsSkeleton.tsx
import React from "react";

const NewsSkeleton: React.FC = () => {
  return (
    <div className="w-full  md:min-h-screen  mb-8 animate-pulse">     
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_3fr_1.5fr] gap-x-4 gap-y-6 w-full ">   
        <div className="flex flex-col gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx}>
              <div className="w-full h-[240px] bg-gray-300 rounded mb-3" />
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
        {/* Middle Column */}
        <div className="flex flex-col gap-6">
          {/* First two large cards */}
          {[...Array(2)].map((_, idx) => (
            <div key={idx}>
              <div className="w-full h-[454px] bg-gray-300 rounded mb-3" />
              <div className="h-7 bg-gray-300 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
          {/* Next two small cards */}
          {[...Array(2)].map((_, idx) => (
            <div key={`small-${idx}`}>
              <div className="w-full h-[240px] bg-gray-300 rounded mb-3" />
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="flex justify-between gap-4 items-start">
              <div className="flex-1">
                <div className="h-5 bg-gray-300 rounded w-4/5 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
              <div className="w-[100px] h-[70px] bg-gray-300 rounded flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsSkeleton;
