import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: 's3rt691469',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
