import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ListTasksDto } from './dto/list-tasks.dto';
export declare class TasksController {
    private service;
    constructor(service: TasksService);
    create(dto: CreateTaskDto): Promise<import("./entities/task.entity").Task>;
    findAll(query: ListTasksDto): Promise<{
        data: import("./entities/task.entity").Task[];
        page: number;
        pageSize: number;
        total: number;
    }>;
    findOne(id: string): Promise<{
        estimates: {
            pending: number;
            inProgress: number;
            total: number;
        };
        id: string;
        title: string;
        description?: string;
        status: import("./entities/task.entity").TaskStatus;
        priority?: import("./entities/task.entity").TaskPriority;
        estimate?: number;
        parent?: import("./entities/task.entity").Task;
        subtasks?: import("./entities/task.entity").Task[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateTaskDto): Promise<import("./entities/task.entity").Task>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
