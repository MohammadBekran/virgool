import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { isArray, isUUID } from 'class-validator';
import type { Request } from 'express';
import slugify from 'slugify';
import { Repository } from 'typeorm';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EEntityName } from 'src/common/enums/entity.enum';
import {
  EBadRequestMessages,
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';
import { generateRandomID } from 'src/common/utils/helper.util';
import { paginate, paginationData } from 'src/common/utils/pagination.util';

import { CategoryService } from '../category/category.service';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from './dto/blog.dto';
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

  async find(paginationDto: PaginationDto, filterDto: FilterBlogDto) {
    const { page, limit, skip } = paginate(paginationDto);
    let { category, search } = filterDto;

    let where = '';

    if (category) {
      if (where.length > 0) where += ' AND ';
      category = category.toLowerCase();

      where += 'LOWER(category.title) = :category';
    }

    if (search) {
      if (where.length > 0) where += ' AND ';

      search = `%${search}%`;
      where +=
        'CONCAT(blog.title, blog.description, blog.content) ILIKE :search';
    }
    console.log(where);

    const [blogs, count] = await this.blogRepository
      .createQueryBuilder(EEntityName.Blog)
      .leftJoin('blog.categories', 'categories')
      .leftJoin('categories.category', 'category')
      .addSelect(['categories.id', 'category.title'])
      .orderBy('blog.created_at', 'DESC')
      .where(where, { category, search })
      .skip(skip)
      .limit(limit)
      .getManyAndCount();

    return {
      pagination: paginationData(count, page, limit),
      blogs,
    };
  }

  async delete(id: string) {
    const blog = await this.checkExistenceBlogByID(id);

    await this.blogRepository.delete(blog);

    return {
      message: EPublicMessages.DeletedSuccessfully,
    };
  }

  async update(id: string, blogDto: UpdateBlogDto) {
    let { title, slug, description, content, time_to_read, image, categories } =
      blogDto;

    const blog = await this.checkExistenceBlogByID(id);

    if (categories) {
      if (!isArray(categories) && typeof categories === 'string') {
        categories = categories.split(',');
      } else if (!isArray(categories)) categories = [];
    }

    let finalSlug = '';
    if (title) {
      finalSlug = title;
      blog.title = title;
    }
    if (slug) {
      finalSlug = slug;
    }
    if (finalSlug) {
      slug = slugify(finalSlug);

      console.log(slug);
      const existBlog = await this.checkExistenceBlogBySlug(slug);
      console.log(existBlog, existBlog?.id !== id);
      if (existBlog && existBlog.id !== id) {
        blog.slug += `-${generateRandomID()}`;
      }
    }
    console.log(finalSlug);
    if (description) blog.description = description;
    if (content) blog.content = content;
    if (time_to_read) blog.time_to_read = time_to_read;
    if (image) blog.image = image;

    await this.blogRepository.save(blog);

    if (categories && isArray(categories) && categories.length > 0) {
      await this.blogCategoryRepository.delete({ blogId: blog.id });
    }
    if (categories) {
      for (const categoryTitle of categories) {
        const category =
          await this.categoryService.findOneByTitle(categoryTitle);

        if (!category) {
          await this.categoryService.createByTitle(categoryTitle);
        } else {
          await this.blogCategoryRepository.insert({
            blogId: blog.id,
            categoryId: category.id,
          });
        }
      }
    }

    return {
      message: EPublicMessages.UpdatedSuccessfully,
    };
  }

  async findOneByID(id: string) {
    const blog = await this.checkExistenceBlogByID(id);

    return blog;
  }

  async findOneBySlug(slug: string) {
    const blog = await this.checkExistenceBlogBySlug(slug);
    if (!blog) {
      throw new NotFoundException(ENotFoundMessages.NotFound);
    }

    return blog;
  }

  async checkExistenceBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOne({
      where: { slug },
      ...this.blogRelationSelects(),
    });

    return blog;
  }

  async checkExistenceBlogByID(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(EBadRequestMessages.InvalidID);
    }

    const blog = await this.blogRepository.findOne({
      where: { id },
      ...this.blogRelationSelects(),
    });
    if (!blog) {
      throw new NotFoundException(ENotFoundMessages.NotFound);
    }

    return blog;
  }

  blogRelationSelects() {
    return {
      relations: {
        categories: {
          category: true,
        },
      },
      select: {
        categories: {
          id: true,
          category: {
            title: true,
          },
        },
      },
    };
  }
}
