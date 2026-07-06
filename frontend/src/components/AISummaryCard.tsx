import type { FC } from 'react';import { ClipboardList, AlertCircle, AlertTriangle, CheckCircle, UserX } from 'lucide-react';
import { Task } from '../types';

interface AISummaryCardProps {
  tasks: Task[];
}

export const AISummaryCard: FC<AISummaryCardProps> = ({ tasks }) => {
  const total = tasks.length;
  const high = tasks.filter((t) => t.priority === 'High').length;
  const medium = tasks.filter((t) => t.priority === 'Medium').length;
  const low = tasks.filter((t) => t.priority === 'Low').length;
  const unassigned = tasks.filter(
    (t) => !t.owner || t.owner.toLowerCase() === 'unassigned'
  ).length;

  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      icon: <ClipboardList className="h-5 w-5 text-slate-500" />,
      bg: 'bg-slate-50 border-slate-200/60',
    },
    {
      label: 'High Priority',
      value: high,
      icon: <AlertCircle className="h-5 w-5 text-rose-500" />,
      bg: 'bg-rose-50/50 border-rose-100',
    },
    {
      label: 'Medium Priority',
      value: medium,
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      bg: 'bg-amber-50/50 border-amber-100',
    },
    {
      label: 'Low Priority',
      value: low,
      icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
      bg: 'bg-emerald-50/50 border-emerald-100',
    },
    {
      label: 'Unassigned',
      value: unassigned,
      icon: <UserX className="h-5 w-5 text-indigo-500" />,
      bg: 'bg-indigo-50/50 border-indigo-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`flex flex-col justify-between p-4 rounded-lg border bg-white shadow-sm transition-all duration-200 ${stat.bg}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-inter font-semibold uppercase tracking-wider text-slate-500">
              {stat.label}
            </span>
            {stat.icon}
          </div>
          <span className="font-serif text-2xl font-bold text-brand-heading">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
};
