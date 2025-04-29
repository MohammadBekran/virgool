import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OTPEntity } from '../user/entities/otp.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokensService } from './tokens.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OTPEntity]), JwtModule],
  controllers: [AuthController],
  providers: [AuthService, TokensService],
  exports: [AuthService, TokensService],
})
export class AuthModule {}
