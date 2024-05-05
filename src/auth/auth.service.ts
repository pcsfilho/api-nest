import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { users } from '@prisma/client';
import { AuthRegisterDTO } from 'src/user/dto/auth.register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly JWTService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}
  createToken(user: users) {
    try {
      const payload = { sub: user.id, email: user.email };
      const accessToken = this.JWTService.sign(payload);
      return {
        accessToken,
        ...user,
        password: undefined,
      };
    } catch (error) {
      console.log('error: ', error);
      throw new BadRequestException(error);
    }
  }
  checkToken(token: string) {
    try {
      const data = this.JWTService.verify(token);
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async login(email: string, password: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (!user) throw new UnauthorizedException('Email e/ou senha incorretos');

    const compare = await bcrypt.compare(password, user.password);

    if (!compare)
      throw new UnauthorizedException('Email e/ou senha incorretos');
    return this.createToken(user);
  }
  async forget(email: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (!user) throw new UnauthorizedException('Email incorreto');

    return true;
  }
  async reset(password: string, token: string) {
    const id = 0;
    const user = await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });

    return this.createToken(user);
  }

  async register(body: AuthRegisterDTO) {
    const user = await this.userService.create(body);
    return this.createToken(user);
  }
}
