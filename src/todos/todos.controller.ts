import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.todosService.findById(id);
  }

  @Post()
  createTodo(
    @Body()
    createTodoDto: {
      title: string;
      completed: boolean;
      timeleft: number;
      workedHour: number;
    },
  ) {
    return this.todosService.create(createTodoDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateTodoDto: { title: string; workedHour: number },
  ) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.todosService.delete(id);
  }
}
