import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request } from 'express';
import { Repository } from 'typeorm';

import { EPublicMessages } from 'src/common/enums/message.enum';
import type { TMulterFile } from 'src/common/types/multer.type';
import { makeAbsoluteAddressOfGivenImagePath } from 'src/common/utils/image.util';

import { ImageDto } from './dto/image.dto';
import { ImageEntity } from './entities/image.entity';

@Injectable({ scope: Scope.REQUEST })
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(imageDto: ImageDto, image: TMulterFile) {
    const { id: userId } = this.request.user;
    const { name, alt } = imageDto;

    const location = makeAbsoluteAddressOfGivenImagePath(image?.path);

    await this.imageRepository.insert({
      name,
      alt: alt ?? name,
      location,
      userId,
    });

    return {
      message: EPublicMessages.CreatedSuccessfully,
    };
  }

  findAll() {
    return `This action returns all image`;
  }

  findOne(id: string) {
    return `This action returns a #${id} image`;
  }

  remove(id: string) {
    return `This action removes a #${id} image`;
  }
}
