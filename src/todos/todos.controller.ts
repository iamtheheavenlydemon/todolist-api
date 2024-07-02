import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('api/v1/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Request() req) {
    return this.todosService.create(createTodoDto, req.user.sub);
  }

  @Get()
  findAll(@Query('status') status: string, @Request() req) {
    return this.todosService.findAll(req.user.sub, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.todosService.findOne(+id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req,
  ) {
    return this.todosService.update(+id, updateTodoDto, req.user.sub);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.todosService.remove(+id, req.user.sub);
  }
}
