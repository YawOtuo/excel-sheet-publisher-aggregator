import { useState, useCallback, useMemo } from 'react';
import { parseExcelFile, organizePublishers, generateSummaryStats } from '@/utils/excelParser';
import type { 
  PublisherRecord, 
  SummaryStats 
} from '@/types';

export const usePublisherData = () => {
  const [publishers, setPublishers] = useState<{ [publisherName: string]: PublisherRecord[] }>({});
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      // Parse all files in parallel
      const processedFiles = await Promise.all(
        Array.from(files).map(file => parseExcelFile(file))
      );

      // Organize data by publishers
      const organizedData = organizePublishers(processedFiles);
      const stats = generateSummaryStats(organizedData);

      setPublishers(organizedData.publishers);
      setSummaryStats(stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error processing files: ${errorMessage}`);
      console.error('File processing error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Filter publishers based on search term
  const filteredPublishers = useMemo(() => {
    if (!searchTerm.trim()) {
      return Object.entries(publishers);
    }
    
    const lowercaseSearchTerm = searchTerm.toLowerCase().trim();
    return Object.entries(publishers).filter(([publisherName]) =>
      publisherName.toLowerCase().includes(lowercaseSearchTerm)
    );
  }, [publishers, searchTerm]);

  // Generate filtered summary stats
  const filteredSummaryStats = useMemo(() => {
    if (!summaryStats || !searchTerm.trim()) {
      return summaryStats;
    }

    const filteredData = Object.fromEntries(filteredPublishers);
    let totalRecords = 0;
    const totalFiles = new Set<string>();
    
    const aggregatedStats = {
      totalBibleStudies: 0,
      totalAuxiliaryPioneers: 0,
      totalRegularPioneers: 0,
      totalSpecialPioneers: 0,
      totalMissionaries: 0,
      totalAuxHours: 0,
      totalRegHours: 0
    };

    Object.values(filteredData).forEach(records => {
      totalRecords += records.length;
      
      records.forEach(record => {
        totalFiles.add(record.sourceFile);
        
        // Count auxiliary pioneers (now using boolean values)
        if (record.auxiliaryPioneer === true) {
          aggregatedStats.totalAuxiliaryPioneers += 1;
        }
        
        // Count regular pioneers (now using boolean values)
        if (record.regularPioneer === true) {
          aggregatedStats.totalRegularPioneers += 1;
        }
        
        // Sum bible studies from all categories (now using numbers)
        aggregatedStats.totalBibleStudies += (record.bibleStudies as number) +
                                             (record.auxBibleStudies as number) +
                                             (record.regBibleStudies as number);
        
        // Sum hours (now using numbers)
        aggregatedStats.totalAuxHours += record.auxHours as number;
        aggregatedStats.totalRegHours += record.regHours as number;
      });
    });

    return {
      ...summaryStats,
      totalPublishers: filteredPublishers.length,
      totalRecords,
      totalFiles: totalFiles.size,
      ...aggregatedStats
    };
  }, [summaryStats, filteredPublishers, searchTerm]);

  const sortedPublishers = useMemo(() => {
    return filteredPublishers.sort(([a], [b]) => a.localeCompare(b));
  }, [filteredPublishers]);

  return {
    // State
    publishers,
    summaryStats: filteredSummaryStats,
    isLoading,
    error,
    searchTerm,
    sortedPublishers,
    
    // Actions
    handleFileUpload,
    handleSearchChange,
    clearSearch,
    
    // Computed values
    totalPublishers: Object.keys(publishers).length,
    filteredPublishersCount: filteredPublishers.length,
    hasData: sortedPublishers.length > 0,
    hasPublishers: Object.keys(publishers).length > 0
  };
}; 