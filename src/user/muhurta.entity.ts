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
export class MuhurtaEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  month: string;

  @Column()
  paksha: string;

  @Column()
  tithi: string;

  @OneToMany(
    (type) => MuhurtatimeEntity,
    (muhurtatimr) => muhurtatimr.muhurtadate,
  )
  muhurtatime: MuhurtatimeEntity[];

  @Column()
  status: string;
}

@Entity()
export class MuhurtatimeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => MuhurtaEntity, (muhurta) => muhurta.muhurtatime, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  muhurtadate: MuhurtaEntity;

  @Column()
  time: Date;

  @Column()
  tithi: string;
}
