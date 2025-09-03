import type { TaskStatus, TaskPriority } from '../entities/task.entity';
import { CreateTaskDto } from './create-task.dto';
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    estimate?: number;
    subtasks?: CreateTaskDto[];
}
