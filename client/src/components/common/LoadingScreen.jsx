import React from 'react';

/**
 * Loading Screen Component
 * Displays a loading spinner during data fetching or page transitions
 */
const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;