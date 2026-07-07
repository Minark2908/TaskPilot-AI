import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { FilterBar } from '../components/FilterBar';
import { TaskTable } from '../components/TaskTable';
import { Pagination } from '../components/Pagination';
import { EditTaskModal } from '../components/EditTaskModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { exportToCsv } from '../utils/exportCsv';
import { taskService } from '../services/taskService';
import { Task, TaskPriority, TaskStatus } from '../types';
import { Download, AlertCircle } from 'lucide-react';

export const TaskManagement: FC = () => {
  const navigate = useNavigate();
  const {
    tasks,
    total,
    skip,
    limit,
    isLoading,
    error,
    fetchTasks,
    updateTask,
    deleteTask,
    setSkip,
  } = useTasks();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [ownersList, setOwnersList] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const queryParams = {
    skip,
    search: searchQuery || undefined,
    owner: selectedOwner || undefined,
    priority: (selectedPriority || undefined) as TaskPriority | undefined,
    status: (selectedStatus || undefined) as TaskStatus | undefined,
  };

  const loadTasks = useCallback(() => {
    fetchTasks(queryParams);
  }, [fetchTasks, skip, searchQuery, selectedOwner, selectedPriority, selectedStatus]);

  useEffect(() => {
    taskService.getTaskOwners().then(setOwnersList).catch(() => setOwnersList([]));
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const resetPagination = () => setSkip(0);

  const handleSearchChange = (value: string) => {
    resetPagination();
    setSearchQuery(value);
  };

  const handleOwnerChange = (value: string) => {
    resetPagination();
    setSelectedOwner(value);
  };

  const handlePriorityChange = (value: string) => {
    resetPagination();
    setSelectedPriority(value);
  };

  const handleStatusChange = (value: string) => {
    resetPagination();
    setSelectedStatus(value);
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const allMatching = await taskService.getAllTasks({
        search: searchQuery || undefined,
        owner: selectedOwner || undefined,
        priority: (selectedPriority || undefined) as TaskPriority | undefined,
        status: (selectedStatus || undefined) as TaskStatus | undefined,
      });
      if (allMatching.length > 0) {
        exportToCsv(allMatching);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewDetails = (task: Task) => {
    navigate(`/tasks/${task.id}`);
  };

  const handleUpdateTask = async (updatedData: Partial<Task>) => {
    if (!editingTask) return;
    await updateTask(editingTask.id, updatedData);
    setEditingTask(null);
    loadTasks();
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    const isLastItemOnPage = tasks.length === 1;
    const shouldGoBack = isLastItemOnPage && skip > 0;

    await deleteTask(deletingTask.id);
    setDeletingTask(null);

    if (shouldGoBack) {
      setSkip(skip - limit);
    } else {
      loadTasks();
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedOwner('');
    setSelectedPriority('');
    setSelectedStatus('');
    setSkip(0);
  };

  const handlePageChange = (nextSkip: number) => {
    setSkip(nextSkip);
  };

  const hasActiveFilters = Boolean(
    searchQuery || selectedOwner || selectedPriority || selectedStatus
  );

  if (isLoading && tasks.length === 0 && total === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
            disabled={total === 0 || isExporting}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded font-inter text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export Filtered CSV'}
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

      {total === 0 && !hasActiveFilters ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedOwner={selectedOwner}
            onOwnerChange={handleOwnerChange}
            selectedPriority={selectedPriority}
            onPriorityChange={handlePriorityChange}
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
            onClearFilters={handleClearFilters}
            ownersList={ownersList}
          />

          {tasks.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-lg shadow-sm">
              No tasks matched your active filter configuration. Click Clear to start over.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <TaskTable
                tasks={tasks}
                onView={handleViewDetails}
                onEdit={setEditingTask}
                onDelete={setDeletingTask}
              />
              <Pagination
                skip={skip}
                limit={limit}
                total={total}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      )}

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
