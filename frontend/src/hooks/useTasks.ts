import { useState, useCallback } from 'react';
import { Task, TaskQueryParams, TaskUpdate } from '../types';
import { taskService } from '../services/taskService';
import { useToast } from './useToast';

const DEFAULT_PAGE_SIZE = 10;

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(DEFAULT_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchTasks = useCallback(async (params: TaskQueryParams = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const page = await taskService.getTasks({
        skip: params.skip ?? skip,
        limit: params.limit ?? limit,
        search: params.search,
        owner: params.owner,
        priority: params.priority,
        status: params.status,
      });
      setTasks(page.items);
      setTotal(page.total);
      setSkip(page.skip);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks.');
      addToast(err.message || 'Failed to fetch tasks.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast, skip, limit]);

  const fetchAllTasks = useCallback(async (params: Omit<TaskQueryParams, 'skip' | 'limit'> = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskService.getAllTasks(params);
      setTasks(data);
      setTotal(data.length);
      setSkip(0);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks.');
      addToast(err.message || 'Failed to fetch tasks.', 'error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  const updateTask = useCallback(async (taskId: number, taskUpdate: TaskUpdate) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, taskUpdate);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      );
      addToast('Task updated successfully.', 'success');
      return updatedTask;
    } catch (err: any) {
      addToast(err.message || 'Failed to update task.', 'error');
      throw err;
    }
  }, [addToast]);

  const deleteTask = useCallback(async (taskId: number) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setTotal((prev) => Math.max(0, prev - 1));
      addToast('Task deleted successfully.', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to delete task.', 'error');
      throw err;
    }
  }, [addToast]);

  const saveMultipleTasks = useCallback(async (tasksToSave: Task[]) => {
    setIsLoading(true);
    let successCount = 0;
    const errorsList: string[] = [];

    for (const task of tasksToSave) {
      try {
        await taskService.updateTask(task.id, {
          description: task.description,
          owner: task.owner,
          due_date: task.due_date,
          priority: task.priority,
          status: task.status,
        });
        successCount++;
      } catch (err: any) {
        errorsList.push(err.message || `Failed to update task ${task.id}`);
      }
    }

    if (successCount > 0) {
      addToast(`Successfully saved ${successCount} task(s).`, 'success');
    }
    if (errorsList.length > 0) {
      addToast(`Failed to save ${errorsList.length} task(s).`, 'error');
    }
    setIsLoading(false);
  }, [addToast]);

  return {
    tasks,
    total,
    skip,
    limit,
    isLoading,
    error,
    fetchTasks,
    fetchAllTasks,
    updateTask,
    deleteTask,
    saveMultipleTasks,
    setSkip,
  };
};
