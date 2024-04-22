import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateUserDTO) {
    return await this.prisma.users.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
      },
    });
  }

  async list() {
    return await this.prisma.users.findMany();
  }

  async show(id: number) {
    // return await this.prisma.users.findFirst({
    //   where: {
    //     id,
    //   },
    // });
    await this.exists(id);
    return await this.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: UpdateUserDTO) {
    await this.exists(id);
    const birthAt: any = data?.birthAt ? new Date(data?.birthAt) : null;
    return await this.prisma.users.update({
      data: {
        ...data,
        birthAt,
      },
      where: {
        id,
      },
    });
  }

  async patch(id: number, data: UpdatePatchUserDTO) {
    await this.exists(id);
    const birthAt: any = data?.birthAt ? new Date(data?.birthAt) : null;
    return await this.prisma.users.update({
      data: {
        ...data,
        birthAt,
      },
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    await this.exists(id);
    return await this.prisma.users.delete({
      where: {
        id,
      },
    });
  }

  async exists(id: number) {
    const count = await this.prisma.users.count({
      where: {
        id,
      },
    });
    if (!count)
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
  }
}
