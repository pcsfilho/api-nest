import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Patch,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { ParamId } from 'src/decorators/param-id.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // @SkipThrottle()
  // @Throttle(20,40)
  @Roles(Role.Admin, Role.User)
  @Post('/')
  async create(@Body() body: CreateUserDTO) {
    return await this.userService.create(body);
  }
  @Roles(Role.Admin, Role.User)
  @Get('/')
  async list() {
    return await this.userService.list();
  }
  @Roles(Role.Admin, Role.User)
  @Get(':id')
  async show(@ParamId() id: number) {
    return await this.userService.show(id);
  }
  @Roles(Role.Admin, Role.User)
  @Put(':id')
  async update(@Body() body: UpdateUserDTO, @Param('id', ParseIntPipe) id) {
    return await this.userService.update(id, body);
  }
  @Roles(Role.Admin, Role.User)
  @Patch(':id')
  async updatePartial(
    @Body() body: UpdatePatchUserDTO,
    @Param('id', ParseIntPipe) id,
  ) {
    return await this.userService.patch(id, body);
  }
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id) {
    return await this.userService.delete(id);
  }
}
