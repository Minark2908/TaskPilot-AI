import type { FC } from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { FilterBar } from '../components/FilterBar';
import { TaskTable } from '../components/TaskTable';
import { EditTaskModal } from '../components/EditTaskModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { exportToCsv } from '../utils/exportCsv';
import { Task } from '../types';
import { Download, AlertCircle } from 'lucide-react';

export const TaskManagement: FC = () => {
  const navigate = useNavigate();
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    updateTask,
    deleteTask,
  } = useTasks();

  // Modals state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Unique list of owners for FilterBar
  const ownersList = useMemo(() => {
    const owners = tasks.map((t) => t.owner || 'Unassigned');
    return Array.from(new Set(owners)).filter(Boolean);
  }, [tasks]);

  // Filter tasks based on query controls
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesOwner = selectedOwner
        ? (task.owner || 'Unassigned').toLowerCase() === selectedOwner.toLowerCase()
        : true;

      const matchesPriority = selectedPriority ? task.priority === selectedPriority : true;

      const matchesStatus = selectedStatus ? task.status === selectedStatus : true;

      return matchesSearch && matchesOwner && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, selectedOwner, selectedPriority, selectedStatus]);

  const handleExportCsv = () => {
    if (filteredTasks.length > 0) {
      exportToCsv(filteredTasks);
    }
  };

  const handleViewDetails = (task: Task) => {
    navigate(`/tasks/${task.id}`);
  };

  const handleUpdateTask = async (updatedData: Partial<Task>) => {
    if (!editingTask) return;
    await updateTask(editingTask.id, updatedData);
    setEditingTask(null);
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    await deleteTask(deletingTask.id);
    setDeletingTask(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedOwner('');
    setSelectedPriority('');
    setSelectedStatus('');
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-brand-heading tracking-tight font-serif">Task Management</h2>
          <p className="text-sm text-slate-500 mt-1 font-sans">
            Browse, search, and edit tasks. Run deep filters and export results to CSV.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={filteredTasks.length === 0}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded font-inter text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Export Filtered CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-rose-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-rose-800">Connection Error</h4>
            <p className="text-sm text-rose-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedOwner={selectedOwner}
            onOwnerChange={setSelectedOwner}
            selectedPriority={selectedPriority}
            onPriorityChange={setSelectedPriority}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onClearFilters={handleClearFilters}
            ownersList={ownersList}
          />

          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-lg shadow-sm">
              No tasks matched your active filter configuration. Click Clear to start over.
            </div>
          ) : (
            <TaskTable
              tasks={filteredTasks}
              onView={handleViewDetails}
              onEdit={setEditingTask}
              onDelete={setDeletingTask}
            />
          )}
        </div>
      )}

      {/* Modals */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
        />
      )}

      {deletingTask && (
        <DeleteConfirmationModal
          task={deletingTask}
          isOpen={!!deletingTask}
          onClose={() => setDeletingTask(null)}
          onConfirm={handleDeleteTask}
        />
      )}
    </div>
  );
};
