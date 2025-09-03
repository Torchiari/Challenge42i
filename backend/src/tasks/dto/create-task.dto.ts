import { IsOptional, IsString, IsIn, IsNumber, Min, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import type { TaskStatus, TaskPriority } from '../entities/task.entity';


export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['Backlog','Unstarted','Started','Completed','Canceled'])
  status?: TaskStatus;

  @IsOptional()
  @IsIn(['Low','Medium','High','Urgent'])
  priority?: TaskPriority;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimate?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  subtasks?: CreateTaskDto[];
}
