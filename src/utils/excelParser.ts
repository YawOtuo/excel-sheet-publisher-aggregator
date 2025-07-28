import * as XLSX from 'xlsx';
import type { 
  ParsedFileData, 
  PublisherRecord, 
  OrganizedPublisherData, 
  ProcessingStats,
  SummaryStats 
} from '@/types';

/**
 * Helper function to convert Excel values to boolean
 * Excel checkboxes can be TRUE, "TRUE", true, 1, "1", etc.
 */
const parseExcelBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase().trim();
    return lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes';
  }
  if (typeof value === 'number') return value === 1;
  return false;
};

/**
 * Helper function to parse numeric values from Excel
 */
const parseExcelNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

/**
 * Parse a single Excel file and extract data
 * @param file - The Excel file to parse
 * @returns Promise with parsed file data and sheet information
 */
export const parseExcelFile = async (file: File): Promise<ParsedFileData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const result: ParsedFileData = {
          name: file.name,
          sheets: {}
        };
        
        // Process each sheet in the workbook
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 'A',
            defval: '',
            raw: false
          });
          
          result.sheets[sheetName] = jsonData;
          (result as any)[sheetName] = jsonData; // Also add directly for backward compatibility
        });
        
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse file ${file.name}: ${(error as Error).message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error(`Failed to read file ${file.name}`));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Find the main data sheet in a parsed file
 * Looks for sheets with names containing dates or common patterns
 * @param fileData - Parsed file data
 * @returns The main data sheet rows
 */
export const findMainDataSheet = (fileData: ParsedFileData): any[] => {
  const sheetNames = Object.keys(fileData.sheets || {});
  
  // Priority order for sheet selection
  const patterns = [
    /january|february|march|april|may|june|july|august|september|october|november|december/i,
    /\d{1,2}[\/\-]\d{1,2}/,  // Date patterns like "1/25" or "01-25"
    /\d{1,2}\s+\d{1,2}/,     // Date patterns like "January 25"
    /data|main|sheet1/i
  ];
  
  // Try to find sheet by pattern priority
  for (const pattern of patterns) {
    const matchedSheet = sheetNames.find(name => pattern.test(name));
    if (matchedSheet && fileData.sheets[matchedSheet]) {
      return fileData.sheets[matchedSheet];
    }
  }
  
  // Fallback to first sheet if no pattern matches
  const firstSheetName = sheetNames[0];
  return firstSheetName ? fileData.sheets[firstSheetName] : [];
};

/**
 * Organize all publisher data from multiple files
 * @param allFilesData - Array of parsed file data
 * @returns Organized data with publishers as keys
 */
export const organizePublishers = (allFilesData: ParsedFileData[]): OrganizedPublisherData => {
  const publishersData: { [publisherName: string]: PublisherRecord[] } = {};
  const processingStats: ProcessingStats = {
    totalFiles: allFilesData.length,
    totalRows: 0,
    publisherRows: 0,
    uniquePublishers: 0
  };

  allFilesData.forEach(fileData => {
    // Get the main data sheet
    const sheet = findMainDataSheet(fileData);
    
    if (!sheet || !Array.isArray(sheet)) {
      console.warn(`No valid data sheet found in file: ${fileData.name}`);
      return;
    }

    // Add file identifier
    const fileIdentifier = fileData.name || `file_${Date.now()}`;
    
    sheet.forEach((row: any, index: number) => {
      processingStats.totalRows++;
      
      // Process all rows - get publisher name from column E
      const publisherName = row.E || '';
      if (!publisherName || publisherName.trim() === '') {
        // If no publisher name, skip this row
        return;
      }
      
      processingStats.publisherRows++;
      
      // Initialize publisher array if it doesn't exist
      if (!publishersData[publisherName]) {
        publishersData[publisherName] = [];
        processingStats.uniquePublishers++;
      }
      
      // Store entire row data plus metadata based on your Excel structure
      const publisherRecord: PublisherRecord = {
        ...row,
        sourceFile: fileIdentifier,
        rowIndex: index + 1,
        publisherName: publisherName,
        
        // Column A: Index/Number
        index: row.A || '',
        
        // Column B: Auxiliary Pioneer status (checkbox)
        auxiliaryPioneer: parseExcelBoolean(row.B),
        
        // Column C: Regular Pioneer status (checkbox)
        regularPioneer: parseExcelBoolean(row.C),
        
        // Column D: Publisher status (checkbox)
        isPublisher: parseExcelBoolean(row.D),
        
        // Column E: Publisher Name
        name: row.E || '',
        
        // For Regular Publishers (Column G & H)
        sharedInMinistry: parseExcelBoolean(row.G),  // G: shared in ministry (checkbox)
        bibleStudies: parseExcelNumber(row.H),       // H: bible studies (number)
        
        // For Auxiliary Pioneers (Column I, J, K)
        auxSharedInMinistry: parseExcelBoolean(row.I),  // I: aux shared in ministry (checkbox)
        auxHours: parseExcelNumber(row.J),              // J: aux hours (number)
        auxBibleStudies: parseExcelNumber(row.K),       // K: aux bible studies (number)
        
        // For Regular Pioneers (Column L, M, N)
        regSharedInMinistry: parseExcelBoolean(row.L),  // L: reg shared in ministry (checkbox)
        regHours: parseExcelNumber(row.M),              // M: reg hours (number)
        regBibleStudies: parseExcelNumber(row.N),       // N: reg bible studies (number)
      };
      
      publishersData[publisherName].push(publisherRecord);
    });
  });

  // Sort each publisher's records by source file and row index for consistency
  Object.keys(publishersData).forEach(publisherName => {
    publishersData[publisherName].sort((a, b) => {
      if (a.sourceFile !== b.sourceFile) {
        return a.sourceFile.localeCompare(b.sourceFile);
      }
      return a.rowIndex - b.rowIndex;
    });
  });

  return {
    publishers: publishersData,
    stats: processingStats
  };
};

/**
 * Generate summary statistics from organized publisher data
 * @param publishersData - Organized publisher data
 * @returns Summary statistics
 */
export const generateSummaryStats = (publishersData: OrganizedPublisherData): SummaryStats => {
  const publishers = publishersData.publishers || {};
  const totalPublishers = Object.keys(publishers).length;
  let totalRecords = 0;
  const totalFiles = new Set<string>();
  
  // Aggregate statistics
  const aggregatedStats = {
    totalBibleStudies: 0,
    totalAuxiliaryPioneers: 0,
    totalRegularPioneers: 0,
    totalSpecialPioneers: 0,
    totalMissionaries: 0,
    totalAuxHours: 0,
    totalRegHours: 0
  };

  Object.values(publishers).forEach(records => {
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

  const { totalFiles: _, ...statsWithoutTotalFiles } = publishersData.stats;

  return {
    totalPublishers,
    totalRecords,
    totalFiles: totalFiles.size,
    ...aggregatedStats,
    ...statsWithoutTotalFiles
  };
}; 