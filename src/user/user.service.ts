import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  async create(data: CreateUserDTO) {
    try {
      const exists = await this.usersRepository.findOneBy({
        email: data?.email,
      });
      if (exists) throw new BadRequestException('E-mail já existe');
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
      const user = await this.usersRepository.create(data);
      return this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async list() {
    return await this.usersRepository.find();
  }

  async show(id: number) {
    // return await this.usersRepository.findFirst({
    //   where: {
    //     id,
    //   },
    // });
    await this.exists(id);
    return await this.usersRepository.findOneBy({
      id,
    });
  }

  async update(id: number, data: UpdateUserDTO) {
    await this.exists(id);
    const birthAt: any = data?.birthAt ? new Date(data?.birthAt) : null;
    if (data?.password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    }

    await this.usersRepository.update(Number(id), {
      ...data,
      birthAt,
    });
    return await this.show(id);
  }

  async patch(id: number, data: UpdatePatchUserDTO) {
    await this.exists(id);
    const birthAt: any = data?.birthAt ? new Date(data?.birthAt) : null;
    if (data?.password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    }

    await this.usersRepository.update(Number(id), {
      ...data,
      birthAt,
    });
    return await this.show(id);
  }

  async delete(id: number) {
    await this.exists(id);
    return await this.usersRepository.delete(id);
  }

  async exists(id: number) {
    const count = await this.usersRepository.countBy({
      id,
    });
    if (!count)
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
  }
}
