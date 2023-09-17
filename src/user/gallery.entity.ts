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
export class GallerycatEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  thumbnail: string;

  @OneToMany((type) => GalleryEntity, (gallery) => gallery.category, {
    onDelete: 'SET NULL',
  })
  gallery: GalleryEntity[];
}

@Entity()
export class GalleryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column()
  name: string;

  @ManyToOne((type) => GallerycatEntity, (category) => category.gallery, {
    cascade: true,
  })
  @JoinColumn()
  category: GallerycatEntity;
}
