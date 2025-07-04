
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center my-6">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-400"></div>
      <p className="ml-3 text-zinc-400">Создание...</p>
    </div>
  );
};

export default LoadingSpinner;