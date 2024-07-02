import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma, Status } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(private db: DatabaseService) {}

  create(createTodoDto: CreateTodoDto, userId: number) {
    return this.db.todo.create({
      data: {
        userId,
        ...createTodoDto,
      },
    });
  }

  findAll(userId: number, status?: string) {
    const where: Prisma.TodoWhereInput = {};

    if (status && Object.values(Status).includes(status as Status)) {
      where.status = status as Status;
    }

    where.userId = userId;
    return this.db.todo.findMany({
      where,
    });
  }

  findOne(id: number, userId: number) {
    return this.db.todo.findFirstOrThrow({
      where: {
        id,
        userId,
      },
    });
  }

  update(id: number, updateTodoDto: UpdateTodoDto, userId: number) {
    return this.db.todo.update({
      where: { id, userId },
      data: updateTodoDto,
    });
  }

  remove(id: number, userId: number) {
    return this.db.todo.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
