import type { FC } from 'react';import { Edit2, Trash2, Eye } from 'lucide-react';
import { Task } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../utils/formatDate';

interface TaskRowProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskRow: FC<TaskRowProps> = ({ task, onView, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors">
      <td className="px-6 py-4 text-sm font-medium text-brand-heading max-w-md truncate">
        {task.description}
      </td>
      <td className="px-6 py-4 text-sm text-slate-500 font-inter">
        {task.owner || 'Unassigned'}
      </td>
      <td className="px-6 py-4 text-sm text-slate-500 font-inter">
        {formatDate(task.due_date)}
      </td>
      <td className="px-6 py-4 text-sm">
        <PriorityBadge priority={task.priority} />
      </td>
      <td className="px-6 py-4 text-sm">
        <StatusBadge status={task.status} />
      </td>
      <td className="px-6 py-4 text-sm text-right">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => onView(task)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="text-slate-400 hover:text-primary transition-colors p-1"
            title="Edit task"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

interface TaskTableProps {
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskTable: FC<TaskTableProps> = ({ tasks, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-inter font-semibold uppercase tracking-wider text-slate-500"
              >
                Task
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-inter font-semibold uppercase tracking-wider text-slate-500"
              >
                Owner
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-inter font-semibold uppercase tracking-wider text-slate-500"
              >
                Due Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-inter font-semibold uppercase tracking-wider text-slate-500"
              >
                Priority
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-inter font-semibold uppercase tracking-wider text-slate-500"
              >
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

