import { DataSourceOptions } from 'typeorm';
import { Task } from './src/tasks/entities/task.entity';

const config: DataSourceOptions = {
  type: 'sqlite',
  database: 'data.sqlite',
  entities: [Task],
  synchronize: true,
  logging: false
};

export default config;
