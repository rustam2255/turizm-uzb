const ArticleSkeleton = () => {
    return (
        <div className="animate-pulse container py-8 space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-6 bg-gray-300 rounded w-2/3"></div>
            <div className="flex items-center gap-4">
                <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
            <div className="w-full h-64 bg-gray-300 rounded"></div>
            <div className="h-5 bg-gray-300 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-5/6"></div>
            <div className="h-5 bg-gray-200 rounded w-4/6"></div>
        </div>
    );
};

export default ArticleSkeleton