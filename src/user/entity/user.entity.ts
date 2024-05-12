import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
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
  @Column({ enum: [1, 2] })
  role: number;
}
