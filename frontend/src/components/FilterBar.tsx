import type { FC } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { TaskPriority, TaskStatus } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedOwner: string;
  onOwnerChange: (owner: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
  ownersList: string[];
}

export const FilterBar: FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedOwner,
  onOwnerChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  onClearFilters,
  ownersList,
}) => {
  const priorities: TaskPriority[] = ['Low', 'Medium', 'High'];
  const statuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedOwner !== '' ||
    selectedPriority !== '' ||
    selectedStatus !== '';

  return (
    <div className="bg-white border border-slate-200/50 rounded-lg p-3 hover:shadow-[0_4px_12px_rgba(30,41,59,0.03)] transition-all duration-200 flex flex-col md:flex-row gap-3.5 items-center justify-between">
      {/* Search Input with inline system shortcut tags */}
      <div className="relative w-full md:w-80">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter database..."
          className="w-full pl-9 pr-14 py-1.5 border border-slate-200 rounded-sm text-xs text-brand-heading placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-sm font-inter">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Dynamic Filter Deck */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs font-inter">
        <div className="flex items-center gap-1 text-slate-400 mr-1 text-[11px] font-semibold uppercase tracking-wider">
          <SlidersHorizontal className="h-3 w-3" />
          Filter
        </div>

        {/* Owner Dropdown */}
        <div className="relative flex items-center">
          <span className="absolute left-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide pointer-events-none">
            Owner:
          </span>
          <select
            value={selectedOwner}
            onChange={(e) => onOwnerChange(e.target.value)}
            className="pl-14 pr-3 py-1.5 border border-slate-200 rounded-sm text-xs font-medium text-brand-heading bg-slate-50 hover:bg-slate-100/50 cursor-pointer focus:outline-none focus:border-primary transition-colors appearance-none min-w-[110px]"
          >
            <option value="">All</option>
            {ownersList.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Dropdown */}
        <div className="relative flex items-center">
          <span className="absolute left-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide pointer-events-none">
            Priority:
          </span>
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="pl-16 pr-3 py-1.5 border border-slate-200 rounded-sm text-xs font-medium text-brand-heading bg-slate-50 hover:bg-slate-100/50 cursor-pointer focus:outline-none focus:border-primary transition-colors appearance-none min-w-[115px]"
          >
            <option value="">All</option>
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="relative flex items-center">
          <span className="absolute left-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide pointer-events-none">
            Status:
          </span>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="pl-14 pr-3 py-1.5 border border-slate-200 rounded-sm text-xs font-medium text-brand-heading bg-slate-50 hover:bg-slate-100/50 cursor-pointer focus:outline-none focus:border-primary transition-colors appearance-none min-w-[110px]"
          >
            <option value="">All</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-sm transition-colors uppercase tracking-wider font-inter"
          >
            <X className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
