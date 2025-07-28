'use client'

import React from 'react';
import type { PublisherRecord, TableHeader } from '@/types';

interface PublisherTableProps {
  publisherName: string;
  records: PublisherRecord[];
}

const PublisherTable: React.FC<PublisherTableProps> = ({ publisherName, records }) => {
  const getTableHeaders = (): TableHeader[] => {
    return [
      { key: 'sourceFile', label: 'Source File' },
      { key: 'name', label: 'Publisher Name' },
      { key: 'auxiliaryPioneer', label: 'Aux Pioneer' },
      { key: 'regularPioneer', label: 'Reg Pioneer' },
      { key: 'isPublisher', label: 'Publisher' },
      { key: 'sharedInMinistry', label: 'Pub: Shared Ministry' },
      { key: 'bibleStudies', label: 'Pub: Bible Studies' },
      { key: 'auxSharedInMinistry', label: 'Aux: Shared Ministry' },
      { key: 'auxHours', label: 'Aux: Hours' },
      { key: 'auxBibleStudies', label: 'Aux: Bible Studies' },
      { key: 'regSharedInMinistry', label: 'Reg: Shared Ministry' },
      { key: 'regHours', label: 'Reg: Hours' },
      { key: 'regBibleStudies', label: 'Reg: Bible Studies' }
    ];
  };

  const formatCellValue = (value: string | number | boolean, key: string): string => {
    // Handle boolean values (checkboxes)
    if (typeof value === 'boolean') {
      return value ? '✓' : '';
    }
    
    // Handle string boolean values
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase().trim();
      if (lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes') {
        return '✓';
      }
      if (lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no' || lowerValue === '') {
        return '';
      }
    }
    
    // Handle numeric values
    if (typeof value === 'number') {
      // For boolean fields, treat 1 as true, 0 as false
      if (key.includes('Pioneer') || key.includes('Ministry') || key.includes('Publisher')) {
        return value === 1 ? '✓' : '';
      }
      // For other numeric fields, show the number
      return value.toString();
    }
    
    // Handle null/undefined/empty
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    
    return String(value);
  };

  const headers = getTableHeaders();

  return (
    <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="bg-blue-600 text-white p-4 m-0 text-lg font-semibold">
        {publisherName} ({records.length} record{records.length !== 1 ? 's' : ''})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {headers.map(header => (
                <th key={header.key} className="bg-gray-50 p-3 text-left border-b-2 border-gray-200 font-semibold text-gray-700 publisher-table-th">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr 
                key={`${record.sourceFile}-${record.rowIndex}-${index}`} 
                className={`hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-25' : ''}`}
              >
                {headers.map(header => (
                  <td key={header.key} className="p-3 border-b border-gray-200 text-gray-700 publisher-table-td">
                    {formatCellValue(record[header.key], header.key as string)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { PublisherTable }; 