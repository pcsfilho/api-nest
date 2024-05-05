import { IsEmail, IsString, MinLength } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';

export class AuthRegisterDTO extends CreateUserDTO {}
