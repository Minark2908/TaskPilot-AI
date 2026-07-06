import { api } from './api';
import { Task, TaskUpdate } from '../types';

export const taskService = {
  async extractTasks(text: string): Promise<Task[]> {
    const response = await api.post<Task[]>('/extract', { text });
    return response.data;
  },

  async getTasks(skip = 0, limit = 100): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks/', {
      params: { skip, limit },
    });
    return response.data;
  },

  async getTask(taskId: number): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${taskId}`);
    return response.data;
  },

  async updateTask(taskId: number, task: TaskUpdate): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${taskId}`, task);
    return response.data;
  },

  async deleteTask(taskId: number): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  },
};
