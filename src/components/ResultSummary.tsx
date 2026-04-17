interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ResultSummaryProps {
  title: string;
  pagination?: Pagination;
}

export default function ResultSummary({ title, pagination }: ResultSummaryProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

      {pagination && (
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Page</p>
            <p className="text-base font-semibold">{pagination.page}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Limit</p>
            <p className="text-base font-semibold">{pagination.limit}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-base font-semibold">{pagination.total}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Total Pages</p>
            <p className="text-base font-semibold">{pagination.totalPages}</p>
          </div>
        </div>
      )}
    </div>
  );
}