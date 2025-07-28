'use client'

import React from 'react';

interface NoDataDisplayProps {
  hasData: boolean;
  isLoading: boolean;
  searchTerm: string;
  hasPublishers: boolean;
}

const NoDataDisplay: React.FC<NoDataDisplayProps> = ({ 
  hasData, 
  isLoading, 
  searchTerm, 
  hasPublishers 
}) => {
  if (isLoading || hasData) return null;

  if (hasPublishers && searchTerm) {
    return (
      <div className="text-center py-10 text-gray-600 italic">
        <h3 className="text-xl font-semibold mb-2">No Publishers Found</h3>
        <p>No publishers match your search term &quot;{searchTerm}&quot;. Try a different search or clear the filter.</p>
      </div>
    );
  }

  return (
    <div className="text-center py-10 text-gray-600 italic">
      <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
      <p>Upload Excel files to see organized publisher data here.</p>
    </div>
  );
};

export { NoDataDisplay }; 