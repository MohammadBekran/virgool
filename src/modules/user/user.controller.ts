import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { API_BEARER_AUTH } from 'src/common/constants/bearer-auth.constant';
import { EAPITagsName } from 'src/common/enums/api-tag.enum';
import { EControllersName } from 'src/common/enums/controller.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { multerStorage } from 'src/common/utils/multer.util';

import { UploadFile } from 'src/common/decorators/upload-file.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProfileDto } from './dto/profile.dto';
import type { TProfileImages } from './types/file.type';
import { UserService } from './user.service';

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
}
