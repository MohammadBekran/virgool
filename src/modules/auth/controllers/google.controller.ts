import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { EAPITagsName } from 'src/common/enums/api-tag.enum';
import { EControllersName } from 'src/common/enums/controller.enum';
import { EEndpointKeys } from 'src/common/enums/endpoint-key.enum';
import { UserService } from 'src/modules/user/user.service';

@Controller(EControllersName.Google)
@ApiTags(EAPITagsName.Google)
@UseGuards(AuthGuard('google'))
export class GoogleController {
  constructor(private userService: UserService) {}

  @Get(EEndpointKeys.GetGoogle)
  googleAuth(@Req() req: Request) {}

  @Get(EEndpointKeys.GetGoogleRedirect)
  googleRedirect(@Req() req: Request) {
    return this.userService.googleLogin(req.user);
  }
}
