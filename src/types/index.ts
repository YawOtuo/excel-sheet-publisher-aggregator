export interface PublisherRecord {
  // Original Excel columns (A, B, C, etc.)
  [key: string]: any;
  
  // Parsed fields
  sourceFile: string;
  rowIndex: number;
  publisherName: string;
  
  // Column A: Index/Number
  index: string | number;
  
  // Column B: Auxiliary Pioneer status
  auxiliaryPioneer: string | boolean;
  
  // Column C: Regular Pioneer status  
  regularPioneer: string | boolean;
  
  // Column D: Publisher status
  isPublisher: string | boolean;
  
  // Column E: Publisher Name
  name: string;
  
  // For Regular Publishers (Column G & H)
  sharedInMinistry: string | boolean;  // G
  bibleStudies: string | number;       // H
  
  // For Auxiliary Pioneers (Column I, J, K)
  auxSharedInMinistry: string | boolean;  // I
  auxHours: string | number;              // J
  auxBibleStudies: string | number;       // K
  
  // For Regular Pioneers (Column L, M, N)
  regSharedInMinistry: string | boolean;  // L
  regHours: string | number;              // M
  regBibleStudies: string | number;       // N
}

export interface ProcessingStats {
  totalFiles: number;
  totalRows: number;
  publisherRows: number;
  uniquePublishers: number;
}

export interface OrganizedPublisherData {
  publishers: { [publisherName: string]: PublisherRecord[] };
  stats: ProcessingStats;
}

export interface SummaryStats extends ProcessingStats {
  totalPublishers: number;
  totalRecords: number;
  totalBibleStudies: number;
  totalAuxiliaryPioneers: number;
  totalRegularPioneers: number;
  totalSpecialPioneers: number;
  totalMissionaries: number;
  totalAuxHours: number;
  totalRegHours: number;
}

export interface ParsedFileData {
  name: string;
  sheets: { [sheetName: string]: any[] };
  [sheetName: string]: any;
}

export interface TableHeader {
  key: keyof PublisherRecord;
  label: string;
}

export interface StatItem {
  label: string;
  value: number;
} 