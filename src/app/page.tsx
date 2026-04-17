'use client';

import { useMemo, useState } from 'react';
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

  const canShowEmpty = !loading && !error && results && results.data.length === 0;

  const summaryTitle = useMemo(() => {
    if (activeTab === 'structured') return 'Structured Search Summary';
    if (activeTab === 'ai') return 'AI Search Summary';
    return 'Chatbot';
  }, [activeTab]);

  // ✅ FIXED: Do NOT override filters
  const handleStructuredSearch = async (page = 1) => {
    try {
      setLoading(true);
      setError('');

      const payload: SearchFilters = {
        ...filters,
        page,
      };

      const response = await searchCompanies(payload);

      // ✅ Only update page, keep existing filters intact
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

  const handleAISearch = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await aiSearchCompanies({ prompt });

      setResults(response);
    } catch (err) {
      setError('AI search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStructuredExport = async () => {
    try {
      setExportLoading(true);

      const blob = await exportSearchResults({
        sector: filters.sector,
        subSector: filters.subSector,
        location: filters.location,
      });

      downloadBlob(blob, buildExportFileName('structured_search_results'));
    } catch {
      setError('Export failed');
    } finally {
      setExportLoading(false);
    }
  };

  const handleAIExport = async () => {
    try {
      if (!results?.parsedFilters) {
        setError('Run AI search first');
        return;
      }

      const blob = await exportSearchResults({
        sector: results.parsedFilters.sector,
        subSector: results.parsedFilters.subSector,
        location: results.parsedFilters.location,
      });

      downloadBlob(blob, buildExportFileName('ai_search_results'));
    } catch {
      setError('AI export failed');
    }
  };

  const handleResetStructured = () => {
    setFilters({
      sector: undefined,
      subSector: undefined,
      location: undefined,
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
    });
    setResults(null);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Prospect Search</h1>

      <div className="space-y-6">
        <SearchTabs activeTab={activeTab} onChange={setActiveTab} />

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
            onSubmit={handleAISearch}
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
            onPrevious={() =>
              handleStructuredSearch((results.pagination.page ?? 1) - 1)
            }
            onNext={() =>
              handleStructuredSearch((results.pagination.page ?? 1) + 1)
            }
            loading={loading}
          />
        )}
      </div>
    </main>
  );
}