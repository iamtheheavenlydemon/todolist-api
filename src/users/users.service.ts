import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { prismaExclude } from 'src/database/prisma-exclude.util';

@Injectable()
export class UsersService {
  private SALT = 12;

  constructor(private db: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, this.SALT);

    return this.db.user.create({
      data: {
        password: hashedPassword,
        ...user,
      },
    });
  }

  findOne(id: number) {
    return this.db.user.findFirstOrThrow({
      where: { id },
      select: prismaExclude('User', ['password']),
    });
  }

  async findOneByEmail(email: string) {
    const user = await this.db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('incorrect email or password');
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.db.user.update({
      where: { id },
      data: updateUserDto,
      select: prismaExclude('User', ['password']),
    });
  }

  remove(id: number) {
    return this.db.user.delete({
      where: { id },
    });
  }
}
