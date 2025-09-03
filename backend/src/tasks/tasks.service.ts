import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  private async createEntityFromDto(dto: CreateTaskDto, parent?: Task): Promise<Task> {
    const task = this.repo.create({
      title: dto.title,
      description: dto.description,
      status: dto.status ?? 'Backlog',
      priority: dto.priority,
      estimate: dto.estimate,
      parent,
    });

    const saved = await this.repo.save(task);

    if (dto.subtasks && dto.subtasks.length) {
      for (const sub of dto.subtasks) {
        await this.createEntityFromDto(sub, saved);
      }
      const found = await this.repo.findOne({ where: { id: saved.id }, relations: ['subtasks'] });
      if (!found) throw new NotFoundException(`Task with id ${saved.id} not found`);
      return found;
    }
    return saved;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
  const task = this.repo.create(dto);

  if (dto.subtasks && dto.subtasks.length > 0) {
    task.subtasks = dto.subtasks.map(st => this.repo.create(st));
  }

  return this.repo.save(task);
}

  async findAll(query: { page?: number; pageSize?: number; sort?: 'asc' | 'desc'; search?: string; status?: 'all' | 'completed' | 'pending' }) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;

    const qb = this.repo.createQueryBuilder('task').leftJoinAndSelect('task.subtasks', 'sub');

    if (query.search) {
      qb.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${query.search}%` });
    }

    if (query.status && query.status !== 'all') {
      if (query.status === 'completed') {
        qb.andWhere('task.status = :st', { st: 'Completed' });
      } else {
        qb.andWhere('task.status <> :st', { st: 'Completed' });
      }
    }

    qb.andWhere('task.parentId IS NULL');
    qb.orderBy('task.title', query.sort === 'desc' ? 'DESC' : 'ASC');

    const total = await qb.getCount();
    const tasks = await qb.skip((page - 1) * pageSize).take(pageSize).getMany();

    const withSubtrees: Task[] = [];
    for (const t of tasks) {
      const full = await this.findOne(t.id);
      withSubtrees.push(full);
    }

    return { data: withSubtrees, page, pageSize, total };
  }

  async findOne(id: string): Promise<Task> {
    const root = await this.repo.findOne({ where: { id }, relations: ['subtasks', 'subtasks.subtasks'], });
    if (!root) throw new NotFoundException(`Task with id ${id} not found`);

    const loadTree = async (task: Task): Promise<Task> => {
      const full = await this.repo.findOne({ where: { id: task.id }, relations: ['subtasks'] });
      if (!full) throw new NotFoundException(`Task with id ${task.id} not found`);
      if (full.subtasks && full.subtasks.length) {
        full.subtasks = await Promise.all(full.subtasks.map(loadTree));
      }
      return full;
    };

    return loadTree(root);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
  const task = await this.repo.findOne({
    where: { id },
    relations: ['subtasks'],
  });

  if (!task) throw new NotFoundException('Task not found');

    Object.assign(task, {
      title: dto.title ?? task.title,
      description: dto.description ?? task.description,
      status: dto.status ?? task.status,
      priority: dto.priority ?? task.priority,
      estimate: dto.estimate ?? task.estimate,
    });

    await this.repo.save(task);

    if (dto.subtasks) {
      const current = await this.repo.find({ where: { parent: { id: task.id } } });
      for (const c of current) await this.repo.remove(c);
      task.subtasks = dto.subtasks.map(st => this.repo.create(st));
      for (const s of dto.subtasks) {
        await this.createEntityFromDto(s, task);
      }
    }

    return this.findOne(task.id);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const t = await this.repo.findOne({ where: { id } });
    if (!t) throw new NotFoundException(`Task with id ${id} not found`);
    await this.repo.remove(t);
    return { deleted: true };
  }

  aggregateEstimates(task: Task) {
    let pending = 0,
      inProgress = 0,
      total = 0;

    const dfs = (t: Task) => {
      const val = t.estimate ?? 0;
      total += val;
      if (t.status === 'Backlog' || t.status === 'Unstarted') pending += val;
      if (t.status === 'Started') inProgress += val;
      if (t.subtasks && t.subtasks.length) t.subtasks.forEach(dfs);
    };

    dfs(task);
    return { pending, inProgress, total };
  }
}
