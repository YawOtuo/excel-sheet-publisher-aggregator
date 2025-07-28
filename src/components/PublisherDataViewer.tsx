'use client'

import React, { ChangeEvent } from 'react';
import { usePublisherData } from '@/hooks/usePublisherData';
import FileUpload from './FileUpload';
import ErrorDisplay from './ErrorDisplay';
import LoadingDisplay from './LoadingDisplay';
import SearchSection from './SearchSection';
import { SummaryStats } from './SummaryStats';
import { NoDataDisplay } from './NoDataDisplay';
import { PublisherTable } from './PublisherTable';

const PublisherDataViewer: React.FC = () => {
  const {
    summaryStats,
    isLoading,
    error,
    searchTerm,
    sortedPublishers,
    handleFileUpload,
    handleSearchChange,
    clearSearch,
    totalPublishers,
    filteredPublishersCount,
    hasData,
    hasPublishers
  } = usePublisherData();

  const onFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event.target.files);
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Publisher Data Aggregator</h1>
      
      <FileUpload 
        onFileUpload={onFileUpload}
        isLoading={isLoading}
      />

      <ErrorDisplay error={error} />

      <LoadingDisplay isLoading={isLoading} />

      {hasPublishers && (
        <SearchSection
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClearSearch={clearSearch}
          totalPublishers={totalPublishers}
          filteredPublishers={filteredPublishersCount}
        />
      )}

      {summaryStats && (
        <SummaryStats 
          summaryStats={summaryStats}
          searchTerm={searchTerm}
        />
      )}

      <NoDataDisplay
        hasData={hasData}
        isLoading={isLoading}
        searchTerm={searchTerm}
        hasPublishers={hasPublishers}
      />

      {sortedPublishers.map(([publisherName, records]) => 
        <PublisherTable 
          key={publisherName}
          publisherName={publisherName}
          records={records}
        />
      )}
    </div>
  );
};

export default PublisherDataViewer; 