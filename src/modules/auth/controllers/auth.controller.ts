import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { EAPITagsName } from 'src/common/enums/api-tag.enum';
import { EControllersName } from 'src/common/enums/controller.enum';
import { EEndpointKeys } from 'src/common/enums/endpoint-key.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

import { AuthDto, OTPDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller(EControllersName.Auth)
@ApiTags(EAPITagsName.Auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(EEndpointKeys.PostUserExistence)
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  userExistence(@Body() authDto: AuthDto, @Res() res: Response) {
    return this.authService.userExistence(authDto, res);
  }

  @Post(EEndpointKeys.PostCheckOTP)
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  checkOTP(@Body() otpDto: OTPDto) {
    return this.authService.checkOTP(otpDto.code);
  }

  @Get(EEndpointKeys.GetCheckLogin)
  @AuthDecorator()
  checkLogin(@Req() req: Request) {
    return req.user;
  }
}
