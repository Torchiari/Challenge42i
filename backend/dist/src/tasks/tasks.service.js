"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const task_entity_1 = require("./entities/task.entity");
let TasksService = class TasksService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async createEntityFromDto(dto, parent) {
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
            if (!found)
                throw new common_1.NotFoundException(`Task with id ${saved.id} not found`);
            return found;
        }
        return saved;
    }
    async create(dto) {
        const task = this.repo.create(dto);
        if (dto.subtasks && dto.subtasks.length > 0) {
            task.subtasks = dto.subtasks.map(st => this.repo.create(st));
        }
        return this.repo.save(task);
    }
    async findAll(query) {
        const page = query.page && query.page > 0 ? query.page : 1;
        const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
        const qb = this.repo.createQueryBuilder('task').leftJoinAndSelect('task.subtasks', 'sub');
        if (query.search) {
            qb.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${query.search}%` });
        }
        if (query.status && query.status !== 'all') {
            if (query.status === 'completed') {
                qb.andWhere('task.status = :st', { st: 'Completed' });
            }
            else {
                qb.andWhere('task.status <> :st', { st: 'Completed' });
            }
        }
        qb.andWhere('task.parentId IS NULL');
        qb.orderBy('task.title', query.sort === 'desc' ? 'DESC' : 'ASC');
        const total = await qb.getCount();
        const tasks = await qb.skip((page - 1) * pageSize).take(pageSize).getMany();
        const withSubtrees = [];
        for (const t of tasks) {
            const full = await this.findOne(t.id);
            withSubtrees.push(full);
        }
        return { data: withSubtrees, page, pageSize, total };
    }
    async findOne(id) {
        const root = await this.repo.findOne({ where: { id }, relations: ['subtasks', 'subtasks.subtasks'], });
        if (!root)
            throw new common_1.NotFoundException(`Task with id ${id} not found`);
        const loadTree = async (task) => {
            const full = await this.repo.findOne({ where: { id: task.id }, relations: ['subtasks'] });
            if (!full)
                throw new common_1.NotFoundException(`Task with id ${task.id} not found`);
            if (full.subtasks && full.subtasks.length) {
                full.subtasks = await Promise.all(full.subtasks.map(loadTree));
            }
            return full;
        };
        return loadTree(root);
    }
    async update(id, dto) {
        const task = await this.repo.findOne({
            where: { id },
            relations: ['subtasks'],
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
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
            for (const c of current)
                await this.repo.remove(c);
            task.subtasks = dto.subtasks.map(st => this.repo.create(st));
            for (const s of dto.subtasks) {
                await this.createEntityFromDto(s, task);
            }
        }
        return this.findOne(task.id);
    }
    async remove(id) {
        const t = await this.repo.findOne({ where: { id } });
        if (!t)
            throw new common_1.NotFoundException(`Task with id ${id} not found`);
        await this.repo.remove(t);
        return { deleted: true };
    }
    aggregateEstimates(task) {
        let pending = 0, inProgress = 0, total = 0;
        const dfs = (t) => {
            const val = t.estimate ?? 0;
            total += val;
            if (t.status === 'Backlog' || t.status === 'Unstarted')
                pending += val;
            if (t.status === 'Started')
                inProgress += val;
            if (t.subtasks && t.subtasks.length)
                t.subtasks.forEach(dfs);
        };
        dfs(task);
        return { pending, inProgress, total };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map