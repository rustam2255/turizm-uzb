import React from "react";

const DocumentSkeleton: React.FC = () => {
  const items = Array.from({ length: 4 });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 space-y-8">
      {items.map((_, idx) => (
        <div
          key={idx}
          className="border border-gray-100 shadow-sm rounded-lg p-5 animate-pulse"
        >
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="flex gap-3">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentSkeleton;
