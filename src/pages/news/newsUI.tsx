import React from "react";
import IMAGE1 from "@assets/images/samarkand-img.png";
import IMAGE2 from "@assets/images/place1.png";
import IMAGE3 from "@assets/images/place3.png"
import NewsSkeleton from "@/components/ui/loaderSkleton/newsSkleton";
import { useTranslation } from "react-i18next";
import { getLocalized } from "@/utils/getLocalized";

interface NewsProps {
    id: number;
    title: { uz?: string; ru?: string; en: string };
    description: { uz?: string; ru?: string; en?: string };
    image: string | null;
    category: {
        id: number;
        name: { en: string; uz?: string; ru?: string };
    }
}

interface NewsUIProps {
    newsData: NewsProps[];
    onCardClick: (id: number, title: string) => void;
    loading: boolean
}

const fallbackImages = [IMAGE1, IMAGE2, IMAGE3];

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    target.src = fallbackImages[randomIndex];
};

const NewsUI: React.FC<NewsUIProps> = ({ newsData, onCardClick, loading }) => {
    const { i18n } = useTranslation();
    const lang = i18n.language;
    
    if (loading) return <NewsSkeleton />;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.5fr_3fr_1.5fr] gap-4 lg:gap-6">
            {/* Left Column - Small Cards */}
            <div className="order-3 sm:order-1 lg:order-1 xl:col-span-1 xl:border-gray-300 xl:border-r xl:pr-4">
                {newsData.slice(4, 8).map(item => (
                    <div
                        key={item.id}
                        onClick={() => onCardClick(item.id, item.title.en)}
                        className="cursor-pointer border-b mb-4 pb-4 lg:mb-6 lg:pb-6 border-gray-300 hover:opacity-80 transition-opacity"
                    >
                        <img
                            src={item.image ?? '"https://example.com/404.jpg"'}
                            alt={item.title.en}
                            onError={handleImageError}
                            className="w-full h-48 sm:h-56 lg:h-60 xl:h-[240px] object-cover mb-3 lg:mb-4 rounded-lg"
                        />
                        <div className="flex flex-col items-start gap-y-1.5">
                            <h4 className="text-[#DE5D26] text-sm lg:text-base">{getLocalized(item.category.name, lang)}</h4>
                            <h3 className="text-[#131313] text-lg sm:text-xl lg:text-2xl leading-tight line-clamp-2">
                                {getLocalized(item.title, lang)}
                            </h3>
                            <p className="text-[#131313] text-sm lg:text-base leading-relaxed font-medium line-clamp-3">
                                {getLocalized(item.description, lang)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Center Column - Main Cards */}
            <div className="order-1 sm:order-2 lg:order-2 sm:col-span-2 lg:col-span-1 xl:col-span-1 xl:border-gray-300 xl:border-r xl:pr-4">
                {/* Large Cards */}
                {newsData.slice(0, 2).map(item => (
                    <div
                        key={item.id}
                        onClick={() => onCardClick(item.id, item.title.en)}
                        className="cursor-pointer border-b pb-4 lg:pb-6 border-gray-300 mb-4 lg:mb-6 hover:opacity-80 transition-opacity"
                    >
                        <img
                            src={item.image ?? '"https://example.com/404.jpg"'}
                            alt={item.title.en}
                            onError={handleImageError}
                            className="w-full h-64 sm:h-72 lg:h-80 xl:h-[454px] object-cover mb-3 lg:mb-4 rounded-lg"
                        />
                        <div className="flex flex-col items-start gap-y-1.5">
                            <h4 className="text-[#DE5D26] text-sm lg:text-base">{getLocalized(item.category.name, lang)}</h4>
                            <h2 className="text-[#131313] text-xl sm:text-2xl lg:text-3xl xl:text-4xl leading-tight line-clamp-2">
                                {getLocalized(item.title, lang)}
                            </h2>
                            <p className="text-[#131313] text-sm lg:text-base leading-relaxed font-medium line-clamp-3">
                                {getLocalized(item.description, lang)}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Medium Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
                    {newsData.slice(2, 4).map(item => (
                        <div
                            key={item.id}
                            onClick={() => onCardClick(item.id, item.title.en)}
                            className="cursor-pointer border-b pb-4 border-gray-300 hover:opacity-80 transition-opacity"
                        >
                            <img
                                src={item.image ?? '"https://example.com/404.jpg"'}
                                alt={item.title.en}
                                onError={handleImageError}
                                className="w-full h-48 sm:h-56 lg:h-60 xl:h-[240px] object-cover mb-3 lg:mb-4 rounded-lg"
                            />
                            <div className="flex flex-col items-start gap-y-1.5">
                                <h4 className="text-[#DE5D26] text-sm lg:text-base">{getLocalized(item.category.name, lang)}</h4>
                                <h3 className="text-[#131313] text-lg sm:text-xl lg:text-2xl leading-tight line-clamp-2">
                                    {getLocalized(item.title, lang)}
                                </h3>
                                <p className="text-[#131313] text-sm lg:text-base leading-relaxed font-medium line-clamp-3">
                                    {getLocalized(item.description, lang)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column - List Items */}
            <div className="order-2 sm:order-3 lg:order-3 xl:col-span-1">
                <div className="pt-4 lg:pt-0">
                    {newsData.slice(8, 20).map(item => (
                        <div
                            key={item.id}
                            onClick={() => onCardClick(item.id, item.title.en)}
                            className="flex justify-between w-full border-b pb-4 pt-4 lg:pt-0 border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <div className="flex flex-col items-start gap-y-1 lg:gap-y-1.5 flex-1 pr-4">
                                <h4 className="text-[#DE5D26] text-sm lg:text-base">{getLocalized(item.category.name, lang)}</h4>
                                <h3 className="text-[#131313] text-base lg:text-lg leading-tight line-clamp-2">
                                    {getLocalized(item.title, lang)}
                                </h3>
                                <p className="text-[#131313] text-sm leading-relaxed font-medium line-clamp-2">
                                    {getLocalized(item.description, lang)}
                                </p>
                            </div>
                            <div className="w-20 sm:w-24 lg:w-28 xl:w-[100px] h-16 sm:h-20 lg:h-24 xl:h-[70px] flex-shrink-0">
                                <img
                                    src={item.image ?? '"https://example.com/404.jpg"'}
                                    loading="lazy"
                                    alt={item.title.en || "NewsCard"}
                                    onError={handleImageError}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsUI;