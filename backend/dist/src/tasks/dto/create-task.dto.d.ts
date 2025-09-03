import type { TaskStatus, TaskPriority } from '../entities/task.entity';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    estimate?: number;
    subtasks?: CreateTaskDto[];
}
