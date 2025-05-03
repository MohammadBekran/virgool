import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { isArray } from 'class-validator';
import type { Request } from 'express';
import slugify from 'slugify';
import { Repository } from 'typeorm';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EPublicMessages } from 'src/common/enums/message.enum';
import { generateRandomID } from 'src/common/utils/helper.util';
import { paginate, paginationData } from 'src/common/utils/pagination.util';

import { CategoryService } from '../category/category.service';
import { CreateBlogDto } from './dto/blog.dto';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { BlogEntity } from './entities/blog.entity';
import { EBlogStatus } from './enums/status.enum';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity)
    private blogCategoryRepository: Repository<BlogCategoryEntity>,
    @Inject(REQUEST) private request: Request,
    private categoryService: CategoryService,
  ) {}

  async create(blogDto: CreateBlogDto) {
    const { id: userId } = this.request.user;
    let { title, slug, description, content, time_to_read, categories } =
      blogDto;

    if (!isArray(categories) && typeof categories === 'string') {
      categories = categories.split(',');
    } else if (!isArray(categories)) categories = [];

    slug = slugify(slug ?? title);
    const existBlog = await this.checkExistenceBlogBySlug(slug);
    if (existBlog) {
      slug += `-${generateRandomID()}`;
    }

    let blog = this.blogRepository.create({
      status: EBlogStatus.Draft,
      authorId: userId,
      title,
      slug,
      description,
      content,
      time_to_read,
    });
    blog = await this.blogRepository.save(blog);

    for (const categoryTitle of categories) {
      const category = await this.categoryService.findOneByTitle(categoryTitle);

      if (!category) {
        await this.categoryService.createByTitle(categoryTitle);
      } else {
        const blogCategory = this.blogCategoryRepository.create({
          blogId: blog.id,
          categoryId: category.id,
        });

        await this.blogCategoryRepository.save(blogCategory);
      }
    }

    return {
      message: EPublicMessages.CreatedSuccessfully,
    };
  }

  async getMyBlogs() {
    const { id: userId } = this.request.user;

    const blogs = await this.blogRepository.find({
      where: { authorId: userId },
    });

    return blogs;
  }

  async find(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginate(paginationDto);

    const [blogs, count] = await this.blogRepository.findAndCount({
      skip,
    });

    return {
      pagination: paginationData(count, page, limit),
      blogs,
    };
  }

  async checkExistenceBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });

    return !!blog;
  }
}
