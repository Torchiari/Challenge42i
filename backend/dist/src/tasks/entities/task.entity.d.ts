export type TaskStatus = 'Backlog' | 'Unstarted' | 'Started' | 'Completed' | 'Canceled';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export declare class Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority?: TaskPriority;
    estimate?: number;
    parent?: Task;
    subtasks?: Task[];
    createdAt: Date;
    updatedAt: Date;
}
