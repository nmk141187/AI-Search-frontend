interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  loading: boolean;
}

export default function PaginationControls({
  page,
  totalPages,
  onPrevious,
  onNext,
  loading,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <button
        type="button"
        onClick={onPrevious}
        disabled={page <= 1 || loading}
        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
      >
        Previous
      </button>

      <p className="text-sm text-slate-600">
        Page <span className="font-semibold text-slate-900">{page}</span> of{' '}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </p>

      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages || loading}
        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}