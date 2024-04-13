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
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';

@Controller('users')
export class UserController {
  @Post('/')
  async create(@Body() body: CreateUserDTO) {
    console.log('data: ', body);
    return body;
  }
  @Get('/')
  async list() {
    return { items: [] };
  }
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id) {
    return { item: {}, id };
  }
  @Put(':id')
  async update(@Body() body: UpdateUserDTO, @Param('id', ParseIntPipe) id) {
    return { method: 'put', id, ...body };
  }
  @Patch(':id')
  async updatePartial(
    @Body() body: UpdatePatchUserDTO,
    @Param('id', ParseIntPipe) id,
  ) {
    return { method: 'patch', ...body, id };
  }
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id) {
    return { method: 'delete', id };
  }
}
