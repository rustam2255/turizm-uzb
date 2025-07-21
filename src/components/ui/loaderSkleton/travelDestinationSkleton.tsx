import React from "react"

const TravelDestionationSkleton: React.FC = () => {
    return (
        <div className="animate-pulse flex flex-col">
            <div className="bg-gray-300 h-48 w-full mb-3 rounded" />
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
            <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 bg-gray-300 rounded-full" />
                <div className="h-4 bg-gray-300 rounded w-1/3" />
            </div>
            <div className="h-4 bg-gray-300 rounded w-full mb-1" />
            <div className="h-4 bg-gray-300 rounded w-5/6" />
        </div>
    )
}

export default TravelDestionationSkleton
