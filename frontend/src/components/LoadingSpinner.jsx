import React from 'react';

const LoadingSpinner = ({ size = 'large', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className={`loading-spinner ${sizeClasses[size]} mx-auto mb-4`}></div>
        <p className="text-gray-600 font-medium animate-pulse">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
