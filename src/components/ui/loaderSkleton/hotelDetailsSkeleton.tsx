import React from "react";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const HotelDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-[1200px] ml-5 py-5 md:py-7.5 space-y-5">
      {/* Breadcrumbs */}
      <Skeleton className="h-4 w-32" />

      {/* Title */}
      <Skeleton className="h-6 w-1/2" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Main Image */}
          <Skeleton className="w-full h-80" />

          {/* Description */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Second Image */}
          <Skeleton className="w-full h-80" />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-5">
          {/* Amenities */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            {[...Array(4)].map((_, idx) => (
              <Skeleton key={idx} className="h-4 w-3/4" />
            ))}
          </div>

          {/* Map */}
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-64 w-full" />
          </div>

          {/* Contact */}
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsSkeleton;
