'use client'

import React from 'react';
import type { SummaryStats, StatItem } from '@/types';

interface SummaryStatsProps {
  summaryStats: SummaryStats | null;
  searchTerm: string;
}

const SummaryStatsComponent: React.FC<SummaryStatsProps> = ({ summaryStats, searchTerm }) => {
  if (!summaryStats) return null;

  const stats: StatItem[] = [
    { label: 'Total Publishers', value: summaryStats.totalPublishers },
    { label: 'Total Records', value: summaryStats.totalRecords },
    { label: 'Files Processed', value: summaryStats.totalFiles },
    { label: 'Bible Studies (All)', value: summaryStats.totalBibleStudies },
    { label: 'Auxiliary Pioneers', value: summaryStats.totalAuxiliaryPioneers },
    { label: 'Regular Pioneers', value: summaryStats.totalRegularPioneers },
    { label: 'Aux Pioneer Hours', value: summaryStats.totalAuxHours },
    { label: 'Reg Pioneer Hours', value: summaryStats.totalRegHours }
  ];

  return (
    <div className="mb-5 p-5 bg-white rounded-lg shadow-md">
      {searchTerm && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-center">
          <span className="text-sm text-gray-600 italic">
            Showing filtered results for &quot;{searchTerm}&quot;
          </span>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-md text-center">
            <span className="block text-2xl font-bold text-blue-600">{stat.value}</span>
            <span className="text-sm text-gray-600">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { SummaryStatsComponent as SummaryStats }; 