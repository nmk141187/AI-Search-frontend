import type { Company } from '@/lib/types';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{company.companyName}</h3>
          <p className="mt-1 text-sm text-slate-600">{company.email}</p>
          <p className="text-sm text-slate-600">{company.phone}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">{company.sector}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {company.subSector}
          </span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {company.location}
          </span>
        </div>
      </div>

      {company.linkedIn && (
        <a
          href={company.linkedIn}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          View LinkedIn
        </a>
      )}

      {company.tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {company.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}