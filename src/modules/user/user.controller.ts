import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { RequiredRoles } from 'src/common/decorators/roles.decorator';
import { UploadFile } from 'src/common/decorators/upload-file.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EAPITagsName } from 'src/common/enums/api-tag.enum';
import { EControllersName } from 'src/common/enums/controller.enum';
import { ECookieKeys } from 'src/common/enums/cookie.enum';
import { EEndpointKeys } from 'src/common/enums/endpoint-key.enum';
import { EPublicMessages } from 'src/common/enums/message.enum';
import { ERole } from 'src/common/enums/role.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { CookieOptions } from 'src/common/utils/cookie.util';
import { multerStorage } from 'src/common/utils/multer.util';

import { OTPDto } from '../auth/dto/auth.dto';
import {
  ChangeEmailDto,
  ChangePhoneDto,
  ChangeUsernameDto,
  ProfileDto,
} from './dto/profile.dto';
import type { TProfileImages } from './types/file.type';
import { UserService } from './user.service';

@Controller(EControllersName.User)
@AuthDecorator()
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

  @Get(EEndpointKeys.GetFind)
  @Pagination()
  @RequiredRoles(ERole.Admin)
  find(@Query() paginationDto: PaginationDto) {
    return this.userService.find(paginationDto);
  }

  @Get(EEndpointKeys.GetProfile)
  profile() {
    return this.userService.profile();
  }

  @Get(EEndpointKeys.Followers)
  @Pagination()
  followers(@Query() paginationDto: PaginationDto) {
    return this.userService.followers(paginationDto);
  }

  @Get(EEndpointKeys.Followings)
  @Pagination()
  followings(@Query() paginationDto: PaginationDto) {
    return this.userService.followings(paginationDto);
  }

  @Get(EEndpointKeys.Follow)
  @ApiParam({ name: 'followingId' })
  follow(@Param('followingId') followingId: string) {
    return this.userService.toggleFollow(followingId);
  }

  @Put(EEndpointKeys.UpdateProfile)
  @ApiConsumes(ESwaggerConsumes.FormData)
  updateProfile(
    @UploadFile()
    files: TProfileImages,
    @Body() profileDto: ProfileDto,
  ) {
    return this.userService.updateProfile(profileDto, files);
  }

  @Patch(EEndpointKeys.PatchChangeEmail)
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
      message: EPublicMessages.OTPSentSuccessfully,
      code,
    });
  }

  @Post(EEndpointKeys.PostVerifyEmail)
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  verifyEmail(@Body() otpDto: OTPDto) {
    return this.userService.verifyEmail(otpDto.code);
  }

  @Patch(EEndpointKeys.PatchChangePhone)
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  async changePhone(@Body() phoneDto: ChangePhoneDto, @Res() res: Response) {
    const { code, token, message } = await this.userService.changePhone(
      phoneDto.phone,
    );

    if (message) {
      return res.json({
        message,
      });
    }

    res.cookie(ECookieKeys.PhoneOTP, token, CookieOptions());

    return res.json({
      message: EPublicMessages.OTPSentSuccessfully,
      code,
    });
  }

  @Post(EEndpointKeys.PostVerifyPhone)
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  verifyPhone(@Body() otpDto: OTPDto) {
    return this.userService.verifyPhone(otpDto.code);
  }

  @Patch(EEndpointKeys.PatchChangeUsername)
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  async changeUsername(@Body() usernameDto: ChangeUsernameDto) {
    return this.userService.changeUsername(usernameDto.username);
  }
}
