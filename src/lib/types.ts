export interface Company {
  _id?: string;
  companyName: string;
  email: string;
  phone: string;
  sector: string;
  subSector: string;
  location: string;
  linkedIn?: string;
  tags?: string[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SearchFilters {
  sector?: string;
  subSector?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export interface ParsedFilters {
  sector?: string;
  subSector?: string;
  location?: string;
  tags?: string[];
}

export interface AISearchPayload {
  prompt: string;
}

export interface SearchResponse {
  success: boolean;
  message: string;
  filters?: SearchFilters;
  parsedFilters?: ParsedFilters;
  pagination: Pagination;
  data: Company[];
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}