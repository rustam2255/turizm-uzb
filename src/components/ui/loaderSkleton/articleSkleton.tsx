const ArticleSkleton: React.FC = () => {
    return (
        <div className="flex h-full flex-col animate-pulse">
            <div className="w-full h-55 md:h-60 bg-gray-300 rounded"></div>

            <div className="flex flex-col justify-between flex-1 mt-4 space-y-2">
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-5 bg-gray-300 rounded w-2/4"></div>

                <div className="flex items-center gap-2 mt-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
            </div>
        </div>
    );
};

export default ArticleSkleton