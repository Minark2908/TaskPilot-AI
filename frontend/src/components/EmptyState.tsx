import type { FC } from 'react';import { ClipboardList } from 'lucide-react';

export const EmptyState: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-100 rounded-lg shadow-sm">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-50 text-slate-400 mb-4">
        <ClipboardList className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-brand-heading mb-1">No tasks yet</h3>
      <p className="text-sm text-slate-500 max-w-sm">
        Paste meeting notes and let AI generate structured tasks.
      </p>
    </div>
  );
};
