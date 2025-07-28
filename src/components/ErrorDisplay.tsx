'use client'

import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-5 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
      {error}
    </div>
  );
};

export default ErrorDisplay; 