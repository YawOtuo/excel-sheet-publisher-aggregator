'use client'

import React, { ChangeEvent } from 'react';

interface SearchSectionProps {
  searchTerm: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  totalPublishers: number;
  filteredPublishers: number;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  totalPublishers,
  filteredPublishers
}) => {
  return (
    <div className="mb-8 p-5 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Search Publishers</h2>
      <div className="relative">
        <input
          type="text"
          placeholder="Search publisher names..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full p-3 pr-12 border-2 border-gray-200 rounded-md bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
        />
        {searchTerm && (
          <button
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white border-none rounded-full w-6 h-6 flex items-center justify-center cursor-pointer text-sm hover:bg-gray-600 transition-colors"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-600">
        {filteredPublishers} of {totalPublishers} publishers shown
      </p>
    </div>
  );
};

export default SearchSection; 