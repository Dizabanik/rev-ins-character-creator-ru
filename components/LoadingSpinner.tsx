
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center my-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-400"></div>
      <p className="ml-3 text-slate-300">Загрузка...</p>
    </div>
  );
};

export default LoadingSpinner;