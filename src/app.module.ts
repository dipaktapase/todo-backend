import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'toor',
      database: 'testdb',
      entities: [],
      synchronize: true,
    }),
    TodosModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
