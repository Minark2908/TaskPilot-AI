import type { FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  skip: number;
  limit: number;
  total: number;
  onPageChange: (skip: number) => void;
  isLoading?: boolean;
}

export const Pagination: FC<PaginationProps> = ({
  skip,
  limit,
  total,
  onPageChange,
  isLoading = false,
}) => {
  if (total === 0) return null;

  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = skip + 1;
  const end = Math.min(skip + limit, total);

  const goToPage = (page: number) => {
    const nextSkip = (page - 1) * limit;
    if (nextSkip !== skip && page >= 1 && page <= totalPages) {
      onPageChange(nextSkip);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-2 py-3 border-t border-slate-100">
      <p className="text-xs text-slate-500 font-inter">
        Showing <span className="font-semibold text-slate-700">{start}</span>–
        <span className="font-semibold text-slate-700">{end}</span> of{' '}
        <span className="font-semibold text-slate-700">{total}</span> tasks
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>

        <span className="text-xs text-slate-500 font-inter px-2">
          Page <span className="font-semibold text-slate-700">{currentPage}</span> of{' '}
          <span className="font-semibold text-slate-700">{totalPages}</span>
        </span>

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
