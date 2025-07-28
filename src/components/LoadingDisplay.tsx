'use client'

import React from 'react';

interface LoadingDisplayProps {
  isLoading: boolean;
}

const LoadingDisplay: React.FC<LoadingDisplayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="text-center py-10 text-gray-600">
      <h3 className="text-xl font-semibold mb-2">Processing files...</h3>
      <p>Please wait while we parse and organize your Excel data.</p>
    </div>
  );
};

export default LoadingDisplay; 