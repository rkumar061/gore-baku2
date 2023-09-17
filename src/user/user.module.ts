import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { GalleryEntity, GallerycatEntity } from './gallery.entity';
import { serviceEntity } from './service.entity';
import { MuhurtaEntity, MuhurtatimeEntity } from './muhurta.entity';
import { InquireEntity } from './inuire.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      GalleryEntity,
      GallerycatEntity,
      serviceEntity,
      MuhurtaEntity,
      MuhurtatimeEntity,
      InquireEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
