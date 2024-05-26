import { Role } from 'src/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;
  @Column({
    length: 63,
  })
  name: string;
  @Column({
    length: 127,
    unique: true,
  })
  email: string;
  @Column({
    length: 127,
  })
  password: string;
  @Column({
    type: 'date',
    nullable: true,
  })
  birthAt: string;
  @CreateDateColumn()
  createdAt: string;
  @CreateDateColumn()
  updatedAt: string;
  // @Column({ enum: [1, 2] })
  @Column({ default: Role.User })
  role: number;
}
