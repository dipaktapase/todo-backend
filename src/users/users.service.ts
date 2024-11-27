import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, username: 'admin', password: '', roles: ['admin'] },
    { id: 2, username: 'user', password: '', roles: ['user'] },
  ]

    constructor() {
      this.users = this.users.map((user) => ({
        ...user,
        password: bcrypt.hashSync('password', 10),
      }));
    }

    async findOne(username: string): Promise <User | undefined> {
      return this.users.find((user) => user.username === username);
    }

}
