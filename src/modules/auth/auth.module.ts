import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OTPEntity } from '../user/entities/otp.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { GoogleController } from './controllers/google.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, OTPEntity]),
    JwtModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController, GoogleController],
  providers: [AuthService, TokenService, GoogleStrategy],
  exports: [AuthService, TokenService, GoogleStrategy],
})
export class AuthModule {}
