import { api } from './api';
import { Task, TaskPage, TaskQueryParams, TaskUpdate } from '../types';

function buildTaskParams(params: TaskQueryParams = {}) {
  const query: Record<string, string | number> = {};

  if (params.skip !== undefined) query.skip = params.skip;
  if (params.limit !== undefined) query.limit = params.limit;
  if (params.search?.trim()) query.search = params.search.trim();
  if (params.owner) query.owner = params.owner;
  if (params.priority) query.priority = params.priority;
  if (params.status) query.status = params.status;

  return query;
}

export const taskService = {
  async extractTasks(text: string): Promise<Task[]> {
    const response = await api.post<Task[]>('/extract', { text });
    return response.data;
  },

  async getTasks(params: TaskQueryParams = {}): Promise<TaskPage> {
    const response = await api.get<TaskPage>('/tasks/', {
      params: buildTaskParams(params),
    });
    return response.data;
  },

  async getAllTasks(params: Omit<TaskQueryParams, 'skip' | 'limit'> = {}): Promise<Task[]> {
    const pageSize = 100;
    let skip = 0;
    let total = Infinity;
    const allTasks: Task[] = [];

    while (skip < total) {
      const page = await this.getTasks({ ...params, skip, limit: pageSize });
      allTasks.push(...page.items);
      total = page.total;
      skip += pageSize;
    }

    return allTasks;
  },

  async getTaskOwners(): Promise<string[]> {
    const response = await api.get<string[]>('/tasks/owners');
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
