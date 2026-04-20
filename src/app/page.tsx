'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import AISearchForm from '@/components/AISearchForm';
import ChatBot from '@/components/ChatBot';
import CompanyList from '@/components/CompanyList';
import EmptyState from '@/components/EmptyState';
import ErrorAlert from '@/components/ErrorAlert';
import LoadingState from '@/components/LoadingState';
import PaginationControls from '@/components/PaginationControls';
import ResultSummary from '@/components/ResultSummary';
import SearchFiltersForm from '@/components/SearchFiltersForm';
import SearchTabs from '@/components/SearchTabs';

import { aiSearchCompanies, exportSearchResults, searchCompanies } from '@/lib/api';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/lib/constants';
import type { SearchFilters, SearchResponse } from '@/lib/types';
import { buildExportFileName, downloadBlob } from '@/lib/utils';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'structured' | 'ai' | 'chat'>('structured');

  const [filters, setFilters] = useState<SearchFilters>({
    sector: undefined,
    subSector: undefined,
    location: undefined,
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  });

  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState('');

  const [aiPage, setAiPage] = useState(DEFAULT_PAGE);
  const aiLimit = DEFAULT_LIMIT;

  const canShowEmpty = !loading && !error && results && results.data.length === 0;

  const summaryTitle = useMemo(() => {
    if (activeTab === 'structured') return 'Structured Search Summary';
    if (activeTab === 'ai') return 'AI Search Summary';
    return 'Chatbot';
  }, [activeTab]);

  const handleStructuredSearch = async (page = 1) => {
    try {
      setLoading(true);
      setError('');

      const payload: SearchFilters = {
        ...filters,
        page,
        limit: filters.limit ?? DEFAULT_LIMIT,
      };

      const response = await searchCompanies(payload);

      setFilters((prev) => ({
        ...prev,
        page,
      }));

      setResults(response);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Failed to fetch structured search results');
      } else {
        setError('Unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async (page = 1) => {
    try {
      setLoading(true);
      setError('');

      const response = await aiSearchCompanies({
        prompt,
        page,
        limit: aiLimit,
      });

      setAiPage(page);
      setResults(response);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Failed to fetch AI search results');
      } else {
        setError('AI search failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStructuredExport = async () => {
    try {
      setExportLoading(true);
      setError('');

      const blob = await exportSearchResults({
        sector: filters.sector,
        subSector: filters.subSector,
        location: filters.location,
      });

      downloadBlob(blob, buildExportFileName('structured_search_results'));
    } catch {
      setError('Failed to export structured search results');
    } finally {
      setExportLoading(false);
    }
  };

  const handleAIExport = async () => {
    try {
      setExportLoading(true);
      setError('');

      if (!results?.parsedFilters) {
        setError('Run AI search before exporting results');
        return;
      }

      const blob = await exportSearchResults({
        sector: results.parsedFilters.sector,
        subSector: results.parsedFilters.subSector,
        location: results.parsedFilters.location,
      });

      downloadBlob(blob, buildExportFileName('ai_search_results'));
    } catch {
      setError('Failed to export AI search results');
    } finally {
      setExportLoading(false);
    }
  };

  const handleResetStructured = () => {
    const resetFilters: SearchFilters = {
      sector: undefined,
      subSector: undefined,
      location: undefined,
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
    };

    setFilters(resetFilters);
    setResults(null);
    setError('');

    setTimeout(() => {
      handleStructuredSearch(1);
    }, 0);
  };

  const handleTabChange = (tab: 'structured' | 'ai' | 'chat') => {
    setActiveTab(tab);
    setError('');

    if (tab === 'ai') {
      setResults(null);
      setAiPage(DEFAULT_PAGE);
    }

    if (tab === 'chat') {
      setResults(null);
    }
  };

  useEffect(() => {
    handleStructuredSearch(1);
   
  }, []);

  useEffect(() => {
    if (activeTab === 'structured') {
      handleStructuredSearch(filters.page ?? 1);
    }
    
  }, [activeTab]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">AI Prospect Search</h1>

      <div className="space-y-6">
        <SearchTabs activeTab={activeTab} onChange={handleTabChange} />

        {activeTab === 'structured' && (
          <SearchFiltersForm
            filters={filters}
            onChange={(updated) =>
              setFilters((prev) => ({
                ...prev,
                ...updated,
              }))
            }
            onSubmit={() => handleStructuredSearch(1)}
            onExport={handleStructuredExport}
            onReset={handleResetStructured}
            loading={loading}
            exportLoading={exportLoading}
          />
        )}

        {activeTab === 'ai' && (
          <AISearchForm
            prompt={prompt}
            onPromptChange={setPrompt}
            onSubmit={() => handleAISearch(1)}
            onExport={handleAIExport}
            loading={loading}
            exportLoading={exportLoading}
          />
        )}

        {activeTab === 'chat' && <ChatBot />}

        {error && <ErrorAlert message={error} />}

        {results && activeTab !== 'chat' && (
          <ResultSummary title={summaryTitle} pagination={results.pagination} />
        )}

        {loading && activeTab !== 'chat' && <LoadingState />}

        {canShowEmpty && activeTab !== 'chat' && (
          <EmptyState title="No companies found" description="Try different filters." />
        )}

        {!loading && results?.data?.length && activeTab !== 'chat' && (
          <CompanyList companies={results.data} />
        )}

        {!loading && activeTab === 'structured' && results?.pagination && (
          <PaginationControls
            page={results.pagination.page}
            totalPages={results.pagination.totalPages}
            onPrevious={() => handleStructuredSearch((results.pagination.page ?? 1) - 1)}
            onNext={() => handleStructuredSearch((results.pagination.page ?? 1) + 1)}
            loading={loading}
          />
        )}

        {!loading && activeTab === 'ai' && results?.pagination && results.pagination.totalPages > 1 && (
          <PaginationControls
            page={results.pagination.page}
            totalPages={results.pagination.totalPages}
            onPrevious={() => handleAISearch((results.pagination.page ?? 1) - 1)}
            onNext={() => handleAISearch((results.pagination.page ?? 1) + 1)}
            loading={loading}
          />
        )}
      </div>
    </main>
  );
}