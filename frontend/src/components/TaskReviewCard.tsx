import type { FC } from 'react';import { User, Calendar, AlertCircle, Trash2 } from 'lucide-react';
import { Task, TaskPriority } from '../types';

interface TaskReviewCardProps {
  task: Task;
  onChange: (updatedTask: Task) => void;
  onDelete: (id: number) => void;
}

export const TaskReviewCard: FC<TaskReviewCardProps> = ({ task, onChange, onDelete }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative">
      <button
        onClick={() => onDelete(task.id)}
        className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors p-1"
        title="Delete task from extraction list"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <div className="space-y-4">
        {/* Description field */}
        <div>
          <label className="block text-[10px] font-inter font-bold uppercase tracking-wider text-slate-400 mb-1">
            Task Description
          </label>
          <input
            type="text"
            value={task.description}
            onChange={(e) => onChange({ ...task, description: e.target.value })}
            className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm text-brand-heading focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        {/* Owner & Due Date grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-inter font-bold uppercase tracking-wider text-slate-400 mb-1">
              <User className="h-3 w-3" />
              Owner
            </label>
            <input
              type="text"
              value={task.owner}
              onChange={(e) => onChange({ ...task, owner: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm text-brand-heading focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-inter font-bold uppercase tracking-wider text-slate-400 mb-1">
              <Calendar className="h-3 w-3" />
              Due Date
            </label>
            <input
              type="date"
              value={task.due_date || ''}
              onChange={(e) => onChange({ ...task, due_date: e.target.value || null })}
              className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm text-brand-heading focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Priority dropdown */}
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-inter font-bold uppercase tracking-wider text-slate-400 mb-1">
            <AlertCircle className="h-3 w-3" />
            Priority
          </label>
          <select
            value={task.priority}
            onChange={(e) => onChange({ ...task, priority: e.target.value as TaskPriority })}
            className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm text-brand-heading bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

interface TaskReviewListProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  onSaveAll: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const TaskReviewList: FC<TaskReviewListProps> = ({
  tasks,
  onTasksChange,
  onSaveAll,
  onCancel,
  isSaving,
}) => {
  const handleCardChange = (updated: Task) => {
    onTasksChange(tasks.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleCardDelete = (id: number) => {
    onTasksChange(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-brand-heading">Review Extracted Tasks</h2>
          <p className="text-sm text-slate-500">
            Review and adjust AI-extracted action items before saving them.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 border border-slate-200 rounded font-inter text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSaveAll}
            disabled={isSaving || tasks.length === 0}
            className="px-5 py-2 bg-primary text-white hover:bg-primary-dark font-inter text-xs font-semibold uppercase tracking-wider rounded transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? 'Saving...' : 'Save All Tasks'}
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-white border rounded-lg shadow-sm">
          No tasks remaining to review. Click Cancel or Back to return.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskReviewCard
              key={task.id}
              task={task}
              onChange={handleCardChange}
              onDelete={handleCardDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
