import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksService (unit)', () => {
  let service: TasksService;
  let repo: any;

  beforeEach(() => {
    repo = {
      create: jest.fn((dto) => dto),
      save: jest.fn(async (t) => ({ ...t, id: 'id-1', createdAt: new Date(), updatedAt: new Date() })),
      findOne: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
    };
    service = new TasksService(repo);
  });

  // --------------------------
  // Test aggregateEstimates
  // --------------------------
  it('aggregateEstimates sums correctly', () => {
    const task: any = {
      estimate: 2,
      status: 'Backlog',
      subtasks: [
        { estimate: 3, status: 'Started', subtasks: [] },
        { estimate: 1, status: 'Backlog', subtasks: [{ estimate: 4, status: 'Unstarted', subtasks: [] }] }
      ]
    };

    const agg = service.aggregateEstimates(task);
    expect(agg.total).toBe(10);
    expect(agg.inProgress).toBe(3);
    expect(agg.pending).toBe(7);
  });

  // --------------------------
  // Test create
  // --------------------------
  it('should create a task', async () => {
    const dto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test description',
      status: 'Backlog',
      estimate: 5,
    };

    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 'id-1');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
  });

  // --------------------------
  // Test findAll
  // --------------------------
  it('should return all tasks', async () => {
    const tasks: Task[] = [
      { id: '1', title: 'Task 1', status: 'Backlog', subtasks: [], createdAt: new Date(), updatedAt: new Date() } as Task,
      { id: '2', title: 'Task 2', status: 'Started', subtasks: [], createdAt: new Date(), updatedAt: new Date() } as Task,
    ];

    repo.createQueryBuilder = jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(2),
      getMany: jest.fn().mockResolvedValue(tasks),
    }));

    service.findOne = jest.fn().mockResolvedValue(tasks[0]);

    const result = await service.findAll({});
    expect(result.data).toBeDefined();
    expect(result.total).toBe(2);
  });

  // --------------------------
  // Test findOne
  // --------------------------
  it('should return a task by id', async () => {
    const task = { 
      id: '1', 
      title: 'Task 1', 
      status: 'Backlog', 
      subtasks: [], 
      createdAt: new Date(), 
      updatedAt: new Date() 
    } as Task;
    repo.findOne.mockResolvedValue(task);

    const result = await service.findOne('1');
    expect(result).toBeDefined();
  });

  // --------------------------
  // Test remove
  // --------------------------
  it('should remove a task', async () => {
    const task = { id: '1' } as Task;
    repo.findOne.mockResolvedValue(task);
    repo.remove.mockResolvedValue({});

    const result = await service.remove('1');
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(repo.remove).toHaveBeenCalledWith(task);
    expect(result).toEqual({ deleted: true });
  });
});
