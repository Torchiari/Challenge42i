import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ListTasksDto } from './dto/list-tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private service: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto) {
    return this.service.create(dto);
  }

  @Get()
  async findAll(@Query() query: ListTasksDto) {
    const q = {
      page: Number(query.page) || 1,
      pageSize: Number(query.pageSize) || 20,
      sort: (query.sort as any) || 'asc',
      search: query.search,
      status: (query.status as any) || 'all'
    };
    return this.service.findAll(q);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const task = await this.service.findOne(id);
    const estimates = this.service.aggregateEstimates(task);
    return { ...task, estimates };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
