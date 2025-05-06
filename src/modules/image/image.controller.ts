import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { AuthDecorator } from 'src/common/decorators/auth-decorator.decorator';
import { EAPITagsName } from 'src/common/enums/api-tag.enum';
import { EControllersName } from 'src/common/enums/controller.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { UploadFileInterceptor } from 'src/common/interceptors/upload-file.interceptor';
import type { TMulterFile } from 'src/common/types/multer.type';

import { ImageDto } from './dto/image.dto';
import { ImageService } from './image.service';

@Controller(EControllersName.Image)
@ApiTags(EAPITagsName.Image)
@AuthDecorator()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(UploadFileInterceptor('image'))
  @ApiConsumes(ESwaggerConsumes.FormData)
  create(@Body() imageDto: ImageDto, @UploadedFile() image: TMulterFile) {
    return this.imageService.create(imageDto, image);
  }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(id);
  }
}
