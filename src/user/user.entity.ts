import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    NoNeedToReleaseEntityManagerError,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';


@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    default: 'user',
  })
  role: string;



    @Column()
    password: string;
}