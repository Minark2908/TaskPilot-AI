import { useState, useCallback } from 'react';
import { Task, TaskUpdate } from '../types';
import { taskService } from '../services/taskService';
import { useToast } from './useToast';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks.');
      addToast(err.message || 'Failed to fetch tasks.', 'error');
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
    } catch (err: any) {
      addToast(err.message || 'Failed to update task.', 'error');
      throw err;
    }
  }, [addToast]);

  const deleteTask = useCallback(async (taskId: number) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
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

    await fetchTasks();

    if (successCount > 0) {
      addToast(`Successfully saved ${successCount} task(s).`, 'success');
    }
    if (errorsList.length > 0) {
      addToast(`Failed to save ${errorsList.length} task(s).`, 'error');
    }
    setIsLoading(false);
  }, [fetchTasks, addToast]);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    updateTask,
    deleteTask,
    saveMultipleTasks,
  };
};
