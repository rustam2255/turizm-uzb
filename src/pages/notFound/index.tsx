import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-800 mb-4">404</p>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Sahifa topilmadi</h2>
        <p className="text-gray-600 mb-6">
          Siz qidirayotgan sahifa mavjud emas yoki ko‘chirilgan bo‘lishi mumkin.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#242424] hover:bg-[#3d3d3d]  text-white px-6 py-2 rounded  transition duration-300"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
