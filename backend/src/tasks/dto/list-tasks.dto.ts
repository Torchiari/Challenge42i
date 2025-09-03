import { IsOptional, IsIn, IsNumberString } from 'class-validator';

export class ListTasksDto {
  @IsOptional()
  page?: number;

  @IsOptional()
  pageSize?: number;

  @IsOptional()
  sort?: 'asc' | 'desc';

  @IsOptional()
  search?: string;

  @IsOptional()
  @IsIn(['all','completed','pending'])
  status?: 'all' | 'completed' | 'pending';
}
