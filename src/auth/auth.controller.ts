import {
  Body,
  Controller,
  Header,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthForgetDTO } from 'src/user/dto/auth.forget.dto';
import { AuthLoginDTO } from 'src/user/dto/auth.login.dto';
import { AuthRegisterDTO } from 'src/user/dto/auth.register.dto';
import { AuthResetDTO } from 'src/user/dto/auth.reset.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return await this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return await this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDTO) {
    return await this.authService.reset(password, token);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User('email') user) {
    return { user };
  }
}
