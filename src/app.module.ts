import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './user/user.entity';
import { UserModule } from './user/user.module';
import { GalleryEntity, GallerycatEntity } from './user/gallery.entity';
import { serviceEntity } from './user/service.entity';
import { MuhurtaEntity, MuhurtatimeEntity } from './user/muhurta.entity';
import { InquireEntity } from './user/inuire.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'blaze.herosite.pro',
      port: 3306,
      username: 'gdqchcar_iceesen',
      password: 'a+}g(J&_2d-+',
      database: 'gdqchcar_gore',
      entities: [
        UserEntity,
        GalleryEntity,
        GallerycatEntity,
        serviceEntity,
        MuhurtaEntity,
        MuhurtatimeEntity,
        InquireEntity,
      ],
      synchronize: true,
      // dropSchema: true
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
