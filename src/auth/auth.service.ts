import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    if (!user) {
      throw new UnauthorizedException('incorrect email or password');
    }

    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user && !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('incorrect email or password');
    }

    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async profile(id: number) {
    return this.usersService.findOne(id);
  }
}
