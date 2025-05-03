import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import slugify from 'slugify';
import { Repository } from 'typeorm';

import { EPublicMessages } from 'src/common/enums/message.enum';
import { generateRandomID } from 'src/common/utils/helper.util';

import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto } from './dto/blog.dto';
import { BlogEntity } from './entities/blog.entity';
import { EBlogStatus } from './enums/status.enum';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(blogDto: CreateBlogDto) {
    const { id: userId } = this.request.user;
    let { title, slug, description, content, time_to_read } = blogDto;

    slug = slugify(slug ?? title);
    const existBlog = await this.checkExistenceBlogBySlug(slug);
    if (existBlog) {
      slug += `-${generateRandomID()}`;
    }

    const blog = this.blogRepository.create({
      status: EBlogStatus.Draft,
      authorId: userId,
      title,
      slug,
      description,
      content,
      time_to_read,
    });
    await this.blogRepository.save(blog);

    return {
      message: EPublicMessages.CreatedSuccessfully,
    };
  }

  async checkExistenceBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });

    return !!blog;
  }
}
