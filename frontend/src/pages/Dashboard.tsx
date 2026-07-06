import type { FC } from 'react';
import { useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { exportToCsv } from '../utils/exportCsv';
import { Task } from '../types';
import { Sparkles, Download, AlertCircle, ArrowRight, Calendar, User } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

export const Dashboard: FC = () => {
  const { tasks, isLoading, error, fetchTasks } = useTasks();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleExportCsv = () => {
    if (tasks.length > 0) {
      exportToCsv(tasks);
    }
  };

  const handleTaskClick = (taskId: number) => {
    navigate(`/tasks/${taskId}`);
  };

  // Group tasks by Status
  const statusGroups = useMemo(() => {
    const pending = tasks.filter((t) => t.status === 'Pending').slice(0, 4);
    const inProgress = tasks.filter((t) => t.status === 'In Progress').slice(0, 4);
    const completed = tasks.filter((t) => t.status === 'Completed').slice(0, 4);
    return { pending, inProgress, completed };
  }, [tasks]);

  // Group tasks by Priority
  const priorityGroups = useMemo(() => {
    const high = tasks.filter((t) => t.priority === 'High').slice(0, 4);
    const medium = tasks.filter((t) => t.priority === 'Medium').slice(0, 4);
    const low = tasks.filter((t) => t.priority === 'Low').slice(0, 4);
    return { high, medium, low };
  }, [tasks]);

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  // Mini Card component for clean human layout
  const TaskMiniCard: FC<{ task: Task; showPriority?: boolean; showStatus?: boolean }> = ({
    task,
    showPriority = false,
    showStatus = false,
  }) => (
    <div
      onClick={() => handleTaskClick(task.id)}
      className="p-4 bg-white border border-slate-200/50 rounded hover:shadow-[0_8px_20px_rgba(30,41,59,0.05)] hover:-translate-y-0.5 cursor-pointer transition-all duration-200 space-y-3.5 text-left"
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-700 font-sans leading-snug line-clamp-2">
          {task.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-50">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium font-inter">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {task.owner || 'Unassigned'}
          </span>
          {task.due_date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(task.due_date)}
            </span>
          )}
        </div>
        <div>
          {showPriority && <PriorityBadge priority={task.priority} />}
          {showStatus && <StatusBadge status={task.status} />}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 font-sans">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-brand-heading tracking-tight font-serif">Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1 font-sans">
            A concise overview of task workflows and action urgency.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={tasks.length === 0}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded font-inter text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
          <Link
            to="/extract"
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-inter text-xs font-semibold uppercase tracking-wider rounded transition-all duration-200"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Extract Tasks
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-rose-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-rose-800 font-serif">Connection Error</h4>
            <p className="text-sm text-rose-700 mt-0.5 font-sans">{error}</p>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200/50 rounded-lg max-w-xl mx-auto shadow-sm">
          <p className="text-sm text-slate-500 font-sans">No tasks found. Get started by extracting some notes.</p>
          <Link
            to="/extract"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary font-inter uppercase tracking-wider mt-4 hover:underline"
          >
            Extract Tasks
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-12 animate-fadeIn">
          {/* Status Section */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-inter border-b border-slate-100 pb-2">
              Workflow Status Columns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pending */}
              <div className="space-y-3 bg-slate-50/50 p-4 rounded-lg border border-slate-200/40">
                <div className="flex items-center justify-between font-inter text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    Pending
                  </span>
                  <span className="font-serif text-sm font-semibold">{tasks.filter((t) => t.status === 'Pending').length}</span>
                </div>
                <div className="space-y-2.5">
                  {statusGroups.pending.map((task) => (
                    <TaskMiniCard key={task.id} task={task} showPriority />
                  ))}
                  {statusGroups.pending.length === 0 && (
                    <p className="text-[11px] text-slate-400 font-sans italic py-4 text-center">Empty</p>
                  )}
                </div>
              </div>

              {/* In Progress */}
              <div className="space-y-3 bg-slate-50/50 p-4 rounded-lg border border-slate-200/40">
                <div className="flex items-center justify-between font-inter text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    In Progress
                  </span>
                  <span className="font-serif text-sm font-semibold">{tasks.filter((t) => t.status === 'In Progress').length}</span>
                </div>
                <div className="space-y-2.5">
                  {statusGroups.inProgress.map((task) => (
                    <TaskMiniCard key={task.id} task={task} showPriority />
                  ))}
                  {statusGroups.inProgress.length === 0 && (
                    <p className="text-[11px] text-slate-400 font-sans italic py-4 text-center">Empty</p>
                  )}
                </div>
              </div>

              {/* Completed */}
              <div className="space-y-3 bg-slate-50/50 p-4 rounded-lg border border-slate-200/40">
                <div className="flex items-center justify-between font-inter text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Completed
                  </span>
                  <span className="font-serif text-sm font-semibold">{tasks.filter((t) => t.status === 'Completed').length}</span>
                </div>
                <div className="space-y-2.5">
                  {statusGroups.completed.map((task) => (
                    <TaskMiniCard key={task.id} task={task} showPriority />
                  ))}
                  {statusGroups.completed.length === 0 && (
                    <p className="text-[11px] text-slate-400 font-sans italic py-4 text-center">Empty</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Priority Section */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-inter border-b border-slate-100 pb-2">
              Priority Urgency Lists
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* High Priority */}
              <div className="space-y-3 bg-slate-50/50 p-4 rounded-lg border border-slate-200/40">
                <div className="flex items-center justify-between font-inter text-xs font-semibold uppercase tracking-wider text-rose-700 px-1">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    High Urgency
                  </span>
                  <span className="font-serif text-sm font-semibold">{tasks.filter((t) => t.priority === 'High').length}</span>
                </div>
                <div className="space-y-2.5">
                  {priorityGroups.high.map((task) => (
                    <TaskMiniCard key={task.id} task={task} showStatus />
                  ))}
                  {priorityGroups.high.length === 0 && (
                    <p className="text-[11px] text-slate-400 font-sans italic py-4 text-center">Empty</p>
                  )}
                </div>
              </div>

              {/* Medium Priority */}
              <div className="space-y-3 bg-slate-50/50 p-4 rounded-lg border border-slate-200/40">
                <div className="flex items-center justify-between font-inter text-xs font-semibold uppercase tracking-wider text-amber-700 px-1">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Medium Urgency
                  </span>
                  <span className="font-serif text-sm font-semibold">{tasks.filter((t) => t.priority === 'Medium').length}</span>
                </div>
                <div className="space-y-2.5">
                  {priorityGroups.medium.map((task) => (
                    <TaskMiniCard key={task.id} task={task} showStatus />
                  ))}
                  {priorityGroups.medium.length === 0 && (
                    <p className="text-[11px] text-slate-400 font-sans italic py-4 text-center">Empty</p>
                  )}
                </div>
              </div>

              {/* Low Priority */}
              <div className="space-y-3 bg-slate-50/50 p-4 rounded-lg border border-slate-200/40">
                <div className="flex items-center justify-between font-inter text-xs font-semibold uppercase tracking-wider text-emerald-700 px-1">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Low Urgency
                  </span>
                  <span className="font-serif text-sm font-semibold">{tasks.filter((t) => t.priority === 'Low').length}</span>
                </div>
                <div className="space-y-2.5">
                  {priorityGroups.low.map((task) => (
                    <TaskMiniCard key={task.id} task={task} showStatus />
                  ))}
                  {priorityGroups.low.length === 0 && (
                    <p className="text-[11px] text-slate-400 font-sans italic py-4 text-center">Empty</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
