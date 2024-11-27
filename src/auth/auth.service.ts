import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(data) {
    const { username, password } = data;
    // console.log(data, '{}{}{}{}');

    // Validate user (Replace this with your own user validation logic)
    if (username === 'test' && password === '1234') {
      const payload = { username }; // Add more data if needed
      // letaccess_token: this.jwtService.sign(payload),
      const token = this.jwtService.sign(payload);
      return token;
    }
    return 'invalid credentials';
    // console.log('invalid user');
    throw new UnauthorizedException('Invalid credentials');
  }
}
