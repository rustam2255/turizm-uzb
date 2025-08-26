const TourismLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-400 to-sky-400 flex items-center justify-center z-50">
      <div className="text-center text-white">
        {/* Airplane animation */}
        <div className="text-7xl mb-6 animate-bounce">✈️</div>
        
        {/* Loading text */}
        <p className="text-2xl font-bold mb-4 animate-pulse">
          Sayohat Dunyosiga Xush Kelibsiz
        </p>
        
        {/* Progress bar */}
        <div className="w-64 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-white rounded-full animate-progress"></div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-progress {
          animation: progress 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
export default TourismLoader