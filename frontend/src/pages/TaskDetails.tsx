import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { taskService } from '../services/taskService';
import { useToast } from '../hooks/useToast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { Task, TaskPriority, TaskStatus } from '../types';
import { ArrowLeft, User, Calendar, Tag, Activity, Clock, Save, Edit2, ChevronRight } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

interface FormValues {
  description: string;
  owner: string;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export const TaskDetails: FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!taskId) return;
      setIsLoading(true);
      try {
        const data = await taskService.getTask(parseInt(taskId, 10));
        if (data) {
          setTask(data);
          reset({
            description: data.description,
            owner: data.owner,
            due_date: data.due_date || '',
            priority: data.priority,
            status: data.status,
          });
        }
      } catch (err: any) {
        addToast(err.message || 'Failed to retrieve task details.', 'error');
        navigate('/tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId, reset, addToast, navigate]);

  const onSubmit = async (data: FormValues) => {
    if (!task) return;
    try {
      const updated = await taskService.updateTask(task.id, {
        description: data.description,
        owner: data.owner || 'Unassigned',
        due_date: data.due_date || null,
        priority: data.priority,
        status: data.status,
      });
      setTask(updated);
      setIsEditMode(false);
      addToast('Task details updated successfully.', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to update task details.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center p-12 bg-white border border-slate-200 rounded-lg shadow-sm">
        <p className="text-slate-500">Task details not found.</p>
        <Link to="/tasks" className="text-primary font-bold hover:underline mt-4 inline-block">
          Return to Task Management
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400 font-inter font-semibold uppercase tracking-wider">
        <Link to="/tasks" className="hover:text-slate-600 transition-colors">
          Tasks
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-600 truncate max-w-[200px]">
          Task #{task.id}
        </span>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {/* Header Block */}
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <Link
              to="/tasks"
              className="p-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-700"
              title="Back to List"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h2 className="text-lg font-bold text-brand-heading">Task Details</h2>
              <span className="text-xs text-slate-400 font-inter">ID: #{task.id}</span>
            </div>
          </div>
          <div>
            {!isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-inter text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit Task
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        {isEditMode ? (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Description */}
            <div>
              <label className="block text-xs font-inter font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Task Description *
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

            {/* Config details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Owner */}
              <div>
                <label className="block text-xs font-inter font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
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
                <label className="block text-xs font-inter font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  {...register('due_date')}
                  className="w-full px-3 py-2 border border-slate-200 rounded text-sm text-brand-heading focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-inter font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
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
                <label className="block text-xs font-inter font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
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

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-8">
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                disabled={isSubmitting}
                className="px-4 py-2 border border-slate-200 rounded font-inter text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-dark text-white font-inter text-xs font-semibold uppercase tracking-wider rounded transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-8 font-inter">
            {/* Description display */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Description
              </span>
              <p className="text-base font-medium text-brand-heading leading-relaxed">
                {task.description}
              </p>
            </div>

            {/* Metas display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                    Owner Assigned
                  </span>
                  <span className="text-sm font-semibold text-brand-heading">
                    {task.owner || 'Unassigned'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                    Due Date
                  </span>
                  <span className="text-sm font-semibold text-brand-heading">
                    {formatDate(task.due_date)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tag className="h-4 w-4 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Priority
                  </span>
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Activity className="h-4 w-4 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Status
                  </span>
                  <StatusBadge status={task.status} />
                </div>
              </div>
            </div>

            {/* Audit log timestamps */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Created At: {new Date(task.created_at).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Last Updated: {new Date(task.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
