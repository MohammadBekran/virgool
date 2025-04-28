import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

import { AuthService } from './auth.service';
import { AuthDto, OTPDto } from './dto/auth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user-existence')
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  userExistence(@Body() authDto: AuthDto, @Res() res: Response) {
    return this.authService.userExistence(authDto, res);
  }

  @Post('check-otp')
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  checkOTP(@Body() otpDto: OTPDto) {
    return this.authService.checkOTP(otpDto.code);
  }
}
