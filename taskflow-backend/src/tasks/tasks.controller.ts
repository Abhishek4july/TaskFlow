
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { Request } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

type AuthenticatedRequest = Request & {
  user: {
    userId: number;
    email: string;
  };
};

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.tasksService.findAll(req.user.userId);
  }

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(
      req.user.userId,
      createTaskDto,
    );
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(
      +id,
      req.user.userId,
      updateTaskDto,
    );
  }

  @Delete(':id')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.tasksService.remove(
      +id,
      req.user.userId,
    );
  }

  @Get(':id')
findOne(
  @Req() req: AuthenticatedRequest,
  @Param('id') id: string,
) {
  return this.tasksService.findOne(
    +id,
    req.user.userId,
  );
}
}
