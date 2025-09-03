export type TaskStatus = "Backlog" | "Unstarted" | "Started" | "Completed" | "Canceled";
export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  estimate?: number;
  parent?: Task;
  subtasks?: Task[];
  createdAt: string;
  updatedAt: string;
  estimates?: { pending: number; inProgress: number; total: number };
}

export type SortDir = 'asc' | 'desc';
