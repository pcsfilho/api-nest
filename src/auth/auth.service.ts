import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRegisterDTO } from 'src/user/dto/auth.register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AuthService {
  constructor(
    private readonly JWTService: JwtService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  createToken(user: UserEntity) {
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
    const user = await this.usersRepository.findOne({
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
    const user = await this.usersRepository.findOneBy({
      email,
    });
    if (!user) throw new UnauthorizedException('Email incorreto');

    const payload = { sub: user.id, email: user.email };
    const token = this.JWTService.sign(payload);
    console.log('token: ', token);
    await this.mailer.sendMail({
      subject: 'Recuperação de senha',
      to: 'paulo.ecomp@gmail.com',
      template: 'forget',
      context: {
        name: user?.name || user?.email || '',
        token,
      },
    });
    return true;
  }
  async reset(password: string, token: string) {
    try {
      const data = this.JWTService.verify(token);
      const id = data?.sub;
      if (isNaN(Number(id))) throw new BadRequestException('ID inválido');
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(password, salt);
      await this.usersRepository.update(Number(id), {
        password,
      });
      const user = await this.userService.show(Number(id));
      return this.createToken(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async register(body: AuthRegisterDTO) {
    const user = await this.userService.create(body);
    return this.createToken(user);
  }
}
