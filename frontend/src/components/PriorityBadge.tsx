import type { FC } from 'react';import { TaskPriority } from '../types';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export const PriorityBadge: FC<PriorityBadgeProps> = ({ priority }) => {
  const stylesMap = {
    High: 'bg-rose-50 text-rose-700 border-rose-100',
    Medium: 'bg-amber-50 text-amber-700 border-amber-100',
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${stylesMap[priority]}`}
    >
      {priority}
    </span>
  );
};
