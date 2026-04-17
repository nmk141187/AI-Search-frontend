import type { Company } from '@/lib/types';
import CompanyCard from './CompanyCard';

interface CompanyListProps {
  companies: Company[];
}

export default function CompanyList({ companies }: CompanyListProps) {
  return (
    <div className="space-y-4">
      {companies.map((company, index) => (
        <CompanyCard key={company._id ?? `${company.companyName}-${index}`} company={company} />
      ))}
    </div>
  );
}