'use client';

interface AISearchFormProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  onExport: () => void;
  loading: boolean;
  exportLoading: boolean;
}

export default function AISearchForm({
  prompt,
  onPromptChange,
  onSubmit,
  onExport,
  loading,
  exportLoading,
}: AISearchFormProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <label className="mb-2 block text-sm font-medium text-slate-700">AI Prompt</label>

      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        rows={4}
        placeholder="Example: Fintech companies in London doing payments"
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
      />

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Run AI Search'}
        </button>

        <button
          type="button"
          onClick={onExport}
          disabled={exportLoading}
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 disabled:opacity-50"
        >
          {exportLoading ? 'Export AI Results' : 'Export AI Results'}
        </button>
      </div>
    </div>
  );
}