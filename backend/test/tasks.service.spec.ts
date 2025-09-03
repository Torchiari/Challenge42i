import { TasksService } from '../src/tasks/tasks.service';

describe('TasksService (unit)', () => {
  let service: TasksService;
  let repo: any;

beforeEach(() => {
  repo = {
    create: jest.fn((o) => o),
    save: jest.fn(async (t) => ({ ...t, id: 'id-1', createdAt: new Date(), updatedAt: new Date() })),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };
  service = new TasksService(repo);
});

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
});
