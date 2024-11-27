import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);

  constructor(private readonly dataSource: DataSource) {}

  private async executeQuery(query: string, Params: any[] = []) {
    try {
      return await this.dataSource.query(query, Params);
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Database query error');
    }
  }

  private validateId(id: number) {
    id = Number(id); // We are checking is ID a number
    if (!Number.isInteger(id) || id <= 0) {
      this.logger.warn(`Invalid ID: ${id}`);
      throw new BadRequestException('ID must be positive integer');
    }
  }

  async findAll() {
    try {
      const query = 'SELECT * FROM todos';
      const response = await this.executeQuery(query);
      if (!response.length) {
        return {
          statusCode: 300,
          message: 'No data found',
          response: [],
        };
      }
      return {
        statusCode: 200,
        message: 'Successfully received the data',
        response: response,
      };
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number) {
    // console.log('Executing query:', query, 'with id:', id);
    try {
      this.validateId(id);
      const query = 'SELECT * FROM todos WHERE id = ?';
      const result = await this.executeQuery(query, [id]);
      // return result[0] || null;
      if (!result.length) {
        return {
          statusCode: 404,
          message: `Todo with ID ${id} not found`,
        };
      }

      return {
        statusCode: 200,
        message: 'Todo Found',
        response: result[0],
      };
    } catch (error) {
      this.logger.error(`Failed to load ToDO with ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async create(createTodoDto: { title: string; workedHour: number }) {
    try {
      const query = `INSERT INTO todos (title, workedHour)
      VALUES (?, ?)
    `;
      const result = await this.dataSource.query(query, [
        createTodoDto.title,
        createTodoDto.workedHour,
      ]);
      if (!result) {
        return {
          statusCode: 404,
          message: 'New Todo is not created',
        };
      }

      return {
        statusCode: 200,
        message: 'Todo created successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to create Todo : ${error.message}`);
      throw error;
    }
  }

  async update(
    id: number,
    updateTodoDto: { title: string; workedHour: number },
  ) {
    try {
      this.validateId(id);
      const query = `
      UPDATE todos SET title = ?, workedHour = ? WHERE id = ?
      `;
      const result = await this.dataSource.query(query, [
        updateTodoDto.title,
        updateTodoDto.workedHour,
        id,
      ]);
      if (result.affectedRows === 0) {
        return {
          statusCode: 404,
          message: `Todo with ID ${id} not found`,
        };
      }
      // console.log(result.affectedRows);
      return { statusCode: 200, message: 'Todo updated successfully' };
      // result.affectedRows > 0
      //   : { statusCode: 200, message: 'Todo not found' };
    } catch (error) {
      this.logger.error(
        `Failed to update ToDO with ID ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async delete(id: number) {
    try {
      this.validateId(id);
      const query = `DELETE FROM todos WHERE id = ?`;
      // console.log('Executing query:', query, 'with id:', id);
      const result = await this.dataSource.query(query, [id]);
      if (!result.length) {
        return {
          statusCode: 404,
          message: 'Delete failed',
        };
      }
      return result.affectedRows > 0
        ? { statusCode: 200, message: 'Todo deleted successfully' }
        : { message: 'Todo not found' };
    } catch (error) {
      this.logger.error(
        `Failed to delete Todo with ID ${id}: ${error.message}`,
      );
      throw error;
    }
  }
}
