import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { API_BEARER_AUTH } from 'src/common/constants/bearer-auth.constant';
import { EAPITagsName } from 'src/common/enums/api-tag.enum';
import { EControllersName } from 'src/common/enums/controller.enum';
import { EEndpointKeys } from 'src/common/enums/endpoint-key.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

import { AuthService } from './auth.service';
import { AuthDto, OTPDto } from './dto/auth.dto';
import { AuthGuard } from './guards/auth.guard';

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
  @ApiBearerAuth(API_BEARER_AUTH)
  @UseGuards(AuthGuard)
  checkLogin(@Req() req: Request) {
    return req.user;
  }
}
