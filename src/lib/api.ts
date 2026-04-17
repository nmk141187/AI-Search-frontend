import axios from 'axios';
import type { SearchFilters, SearchResponse } from './types';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not configured');
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchCompanies = async (filters: SearchFilters): Promise<SearchResponse> => {
  const response = await apiClient.get<SearchResponse>('/companies/search', {
    params: filters,
  });
  return response.data;
};

export const aiSearchCompanies = async (payload: { prompt: string }): Promise<SearchResponse> => {
  const response = await apiClient.post<SearchResponse>('/companies/ai-search', payload);
  return response.data;
};

export const exportSearchResults = async (filters: SearchFilters): Promise<Blob> => {
  const response = await apiClient.get('/companies/export', {
    params: filters,
    responseType: 'blob',
  });

  return response.data;
};