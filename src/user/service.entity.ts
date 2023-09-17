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
export class serviceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  priority: number;

  @Column()
  name: string;

  @Column()
  tagline: string;

  @Column()
  image: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;
}
