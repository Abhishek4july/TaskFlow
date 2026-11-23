
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number) {
  return this.prisma.task.findMany({
    where: {
      userId: userId,
    },
  });
}

create(userId: number, createTaskDto: CreateTaskDto) {
  return this.prisma.task.create({
    data: {
      ...createTaskDto,
      userId: userId,
    },
  });
}

async update(
  id: number,
  userId: number,
  updateTaskDto: UpdateTaskDto,
) {
  const result = await this.prisma.task.updateMany({
    where: {
      id: id,
      userId: userId,
    },
    data: updateTaskDto,
  });

  if (result.count === 0) {
    throw new NotFoundException('Task not found');
  }

  return this.prisma.task.findFirst({
    where: {
      id: id,
      userId: userId,
    },
  });
}
async remove(id: number, userId: number) {
  const result = await this.prisma.task.deleteMany({
    where: {
      id: id,
      userId: userId,
    },
  });

  if (result.count === 0) {
    throw new NotFoundException('Task not found');
  }

  return {
    message: 'Task deleted successfully',
  };
}

async findOne(id: number, userId: number) {
  const task = await this.prisma.task.findFirst({
    where: {
      id: id,
      userId: userId,
    },
  });

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  return task;
}
}
