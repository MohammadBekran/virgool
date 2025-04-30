import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { API_BEARER_AUTH } from 'src/common/constants/bearer-auth.constant';
import { EAPITagsName } from 'src/common/enums/api-tag.enum';
import { EControllersName } from 'src/common/enums/controller.enum';
import { ECookieKeys } from 'src/common/enums/cookie.enum';
import { EPublicMessages } from 'src/common/enums/message.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { CookieOptions } from 'src/common/utils/cookie.util';
import { multerStorage } from 'src/common/utils/multer.util';

import { UploadFile } from 'src/common/decorators/upload-file.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ChangeEmailDto, ProfileDto } from './dto/profile.dto';
import type { TProfileImages } from './types/file.type';
import { UserService } from './user.service';
import { OTPDto } from '../auth/dto/auth.dto';

@Controller(EControllersName.User)
@ApiBearerAuth(API_BEARER_AUTH)
@UseGuards(AuthGuard)
@UseInterceptors(
  FileFieldsInterceptor(
    [
      { name: 'profile_image', maxCount: 1 },
      { name: 'background_image', maxCount: 1 },
    ],
    {
      storage: multerStorage('user-profile'),
    },
  ),
)
@ApiTags(EAPITagsName.User)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put()
  @ApiConsumes(ESwaggerConsumes.FormData)
  updateProfile(
    @UploadFile()
    files: TProfileImages,
    @Body() profileDto: ProfileDto,
  ) {
    return this.userService.updateProfile(profileDto, files);
  }

  @Get('profile')
  profile() {
    return this.userService.profile();
  }

  @Patch('change-email')
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: Response) {
    const { code, token, message } = await this.userService.changeEmail(
      emailDto.email,
    );

    if (message) {
      return res.json({
        message,
      });
    }

    res.cookie(ECookieKeys.EmailOTP, token, CookieOptions());

    return res.json({
      code,
      message: EPublicMessages.OTPSentSuccessfully,
    });
  }

  @Post('verify-email-otp')
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  verifyEmail(@Body() otpDto: OTPDto) {
    return this.userService.verifyEmail(otpDto.code);
  }
}
