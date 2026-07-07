export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: number;
  description: string;
  owner: string;
  due_date: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface TaskUpdate {
  description?: string;
  owner?: string;
  due_date?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
}

export interface TaskPage {
  items: Task[];
  total: number;
  skip: number;
  limit: number;
}

export interface TaskQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  owner?: string;
  priority?: TaskPriority | '';
  status?: TaskStatus | '';
}
