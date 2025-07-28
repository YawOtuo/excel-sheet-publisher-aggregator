export interface PublisherRecord {
  // Original Excel columns (A, B, C, etc.)
  [key: string]: string | number | boolean;
  
  // Parsed fields
  sourceFile: string;
  rowIndex: number;
  publisherName: string;
  
  // Column A: Index/Number
  index: string | number;
  
  // Column B: Auxiliary Pioneer status
  auxiliaryPioneer: boolean;
  
  // Column C: Regular Pioneer status  
  regularPioneer: boolean;
  
  // Column D: Publisher status
  isPublisher: boolean;
  
  // Column E: Publisher Name
  name: string;
  
  // For Regular Publishers (Column G & H)
  sharedInMinistry: boolean;  // G
  bibleStudies: number;       // H
  
  // For Auxiliary Pioneers (Column I, J, K)
  auxSharedInMinistry: boolean;  // I
  auxHours: number;              // J
  auxBibleStudies: number;       // K
  
  // For Regular Pioneers (Column L, M, N)
  regSharedInMinistry: boolean;  // L
  regHours: number;              // M
  regBibleStudies: number;       // N
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
  sheets: { [sheetName: string]: Record<string, string | number | boolean>[] };
}

export interface TableHeader {
  key: keyof PublisherRecord;
  label: string;
}

export interface StatItem {
  label: string;
  value: number;
} 