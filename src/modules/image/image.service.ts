import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request } from 'express';
import { Repository } from 'typeorm';

import {
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';
import type { TMulterFile } from 'src/common/types/multer.type';

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

    const location = image?.path?.slice(7);

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

  async findAll() {
    const { id: userId } = this.request.user;

    const images = await this.imageRepository.find({
      where: { userId },
      order: { created_at: 'DESC' },
    });

    return images;
  }

  async findOne(id: string) {
    const { id: userId } = this.request.user;

    const image = await this.imageRepository.findOne({
      where: { userId, id },
    });
    if (!image) {
      throw new NotFoundException(ENotFoundMessages.NotFound);
    }

    return image;
  }

  async remove(id: string) {
    const image = await this.findOne(id);
    this.imageRepository.remove(image);

    return {
      message: EPublicMessages.DeletedSuccessfully,
    };
  }
}
