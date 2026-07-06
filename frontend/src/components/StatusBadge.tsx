import type { FC } from 'react';import { TaskStatus } from '../types';

interface StatusBadgeProps {
  status: TaskStatus;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const stylesMap = {
    Pending: 'bg-slate-50 text-slate-700 border-slate-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-100',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${stylesMap[status]}`}
    >
      {status}
    </span>
  );
};
