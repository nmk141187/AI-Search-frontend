'use client';

import { DEFAULT_LIMIT, LOCATIONS, SECTORS, SUB_SECTORS } from '@/lib/constants';
import type { SearchFilters } from '@/lib/types';

interface SearchFiltersFormProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onSubmit: () => void;
  onExport: () => void;
  onReset: () => void;
  loading: boolean;
  exportLoading: boolean;
}

export default function SearchFiltersForm({
  filters,
  onChange,
  onSubmit,
  onExport,
  onReset,
  loading,
  exportLoading,
}: SearchFiltersFormProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Sector</label>
          <select
            value={filters.sector ?? ''}
            onChange={(e) => onChange({ ...filters, sector: e.target.value || undefined, page: 1 })}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
          >
            <option value="">All sectors</option>
            {SECTORS.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Sub Sector</label>
          <select
            value={filters.subSector ?? ''}
            onChange={(e) => onChange({ ...filters, subSector: e.target.value || undefined, page: 1 })}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
          >
            <option value="">All sub sectors</option>
            {SUB_SECTORS.map((subSector) => (
              <option key={subSector} value={subSector}>
                {subSector}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
          <select
            value={filters.location ?? ''}
            onChange={(e) => onChange({ ...filters, location: e.target.value || undefined, page: 1 })}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
          >
            <option value="">All locations</option>
            {LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Limit</label>
          <select
            value={filters.limit ?? DEFAULT_LIMIT}
            onChange={(e) => onChange({ ...filters, limit: Number(e.target.value), page: 1 })}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
          >
            {[10, 20, 50].map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>

        <button
          type="button"
          onClick={onExport}
          disabled={exportLoading}
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 disabled:opacity-50"
        >
          {exportLoading ? 'Exporting...' : 'Export CSV'}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
}