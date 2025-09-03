import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';

export type TaskStatus = 'Backlog' | 'Unstarted' | 'Started' | 'Completed' | 'Canceled';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ type: 'varchar', default: 'Backlog' })
  status: TaskStatus;

  @Column({ type: 'varchar', nullable: true })
  priority?: TaskPriority;

  @Column({ type: 'float', nullable: true })
  estimate?: number;

  @ManyToOne(() => Task, (task) => task.subtasks, { nullable: true, onDelete: 'CASCADE' })
  parent?: Task;

  @OneToMany(() => Task, (task) => task.parent, { cascade: true })
  subtasks?: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
