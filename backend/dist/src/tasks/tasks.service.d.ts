import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private repo;
    constructor(repo: Repository<Task>);
    private createEntityFromDto;
    create(dto: CreateTaskDto): Promise<Task>;
    findAll(query: {
        page?: number;
        pageSize?: number;
        sort?: 'asc' | 'desc';
        search?: string;
        status?: 'all' | 'completed' | 'pending';
    }): Promise<{
        data: Task[];
        page: number;
        pageSize: number;
        total: number;
    }>;
    findOne(id: string): Promise<Task>;
    update(id: string, dto: UpdateTaskDto): Promise<Task>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
    aggregateEstimates(task: Task): {
        pending: number;
        inProgress: number;
        total: number;
    };
}
