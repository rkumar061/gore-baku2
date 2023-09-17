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
  Timestamp,
} from 'typeorm';

@Entity()
export class InquireEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  event: string;

  @Column()
  email: string;

  @Column()
  mobile: string;

  @Column()
  name: string;

  @Column({
    default: 'booked',
  })
  status: string;

  @Column({
    nullable: true,
  })
  utr: string;

  @Column()
  groupsize: string;
}
