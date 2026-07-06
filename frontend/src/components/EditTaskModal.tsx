import type { FC } from 'react';import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTaskData: Partial<Task>) => Promise<void>;
  isOpen: boolean;
}

interface FormValues {
  description: string;
  owner: string;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export const EditTaskModal: FC<EditTaskModalProps> = ({
  task,
  onClose,
  onSave,
  isOpen,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      description: task.description,
      owner: task.owner,
      due_date: task.due_date || '',
      priority: task.priority,
      status: task.status,
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: FormValues) => {
    await onSave({
      description: data.description,
      owner: data.owner || 'Unassigned',
      due_date: data.due_date || null,
      priority: data.priority,
      status: data.status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4">
      <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-brand-heading">Edit Task</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Description */}
          <div>
            <label className="block text-xs font-inter font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Description *
            </label>
            <input
              type="text"
              {...register('description', {
                required: 'Description is required',
                maxLength: {
                  value: 255,
                  message: 'Description must be under 255 characters',
                },
              })}
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm text-brand-heading focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
            />
            {errors.description && (
              <span className="text-xs text-rose-500 mt-1 block">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Owner */}
          <div>
            <label className="block text-xs font-inter font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Owner *
            </label>
            <input
              type="text"
              {...register('owner', {
                required: 'Owner is required',
                maxLength: {
                  value: 100,
                  message: 'Owner must be under 100 characters',
                },
              })}
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm text-brand-heading focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
            />
            {errors.owner && (
              <span className="text-xs text-rose-500 mt-1 block">
                {errors.owner.message}
              </span>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-inter font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Due Date
            </label>
            <input
              type="date"
              {...register('due_date')}
              className="w-full px-3 py-2 border border-slate-200 rounded text-sm text-brand-heading focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-xs font-inter font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Priority
              </label>
              <select
                {...register('priority')}
                className="w-full px-3 py-2 border border-slate-200 rounded text-sm text-brand-heading bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-inter font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-slate-200 rounded text-sm text-brand-heading bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-200 rounded font-inter text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-primary hover:bg-primary-dark text-white font-inter text-xs font-semibold uppercase tracking-wider rounded transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
