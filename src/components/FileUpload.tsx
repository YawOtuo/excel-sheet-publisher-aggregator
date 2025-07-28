'use client'

import React, { ChangeEvent } from 'react';

interface FileUploadProps {
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading }) => {
  return (
    <div className="mb-8 p-5 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload Excel Files</h2>
      <input
        type="file"
        multiple
        accept=".xlsx,.xls"
        onChange={onFileUpload}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      />
      <p className="mt-3 text-sm text-gray-600">
        Select one or more Excel files containing publisher data. 
        Files should have publisher data in column D (PUBS) and publisher names in column E.
      </p>
    </div>
  );
};

export default FileUpload; 