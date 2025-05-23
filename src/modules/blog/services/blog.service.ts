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
import { DataSource, type ObjectLiteral, Repository } from 'typeorm';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EEntityName } from 'src/common/enums/entity.enum';
import {
  EBadRequestMessages,
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';
import { generateRandomID } from 'src/common/utils/helper.util';
import { paginate, paginationData } from 'src/common/utils/pagination.util';
import { EUserStatus } from 'src/modules/user/enums/status.enum';

import { CategoryService } from '../../category/category.service';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { BlogCategoryEntity } from '../entities/blog-category.entity';
import { BlogEntity } from '../entities/blog.entity';
import { BlogBookmarkEntity } from '../entities/bookmark.entity';
import { BlogLikeEntity } from '../entities/like.entity';
import { EBlogStatus } from '../enums/status.enum';
import { BlogCommentService } from './comment.service';
import { ERole } from 'src/common/enums/role.enum';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity)
    private blogCategoryRepository: Repository<BlogCategoryEntity>,
    @InjectRepository(BlogLikeEntity)
    private blogLikeRepository: Repository<BlogLikeEntity>,
    @InjectRepository(BlogBookmarkEntity)
    private blogBookmarkRepository: Repository<BlogBookmarkEntity>,
    @Inject(REQUEST) private request: Request,
    private categoryService: CategoryService,
    private commentService: BlogCommentService,
    private dataSource: DataSource,
  ) {}

  async create(blogDto: CreateBlogDto) {
    const { id: userId } = this.request.user;
    let { title, slug, description, content, time_to_read, categories, image } =
      blogDto;

    if (!isArray(categories) && typeof categories === 'string') {
      categories = categories.split(',');
    } else if (!isArray(categories)) categories = [];

    slug = slugify(slug ?? title);
    const existBlog = await this.blogRepository.findOneBy({
      slug: slug,
    });
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
      image,
    });
    blog = await this.blogRepository.save(blog);

    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        category = await this.categoryService.createByTitle(categoryTitle);
      }

      this.blogCategoryRepository.insert({
        blogId: blog.id,
        categoryId: category.id,
      });
    }

    return {
      message: EPublicMessages.CreatedSuccessfully,
    };
  }

  async getMyBlogs(paginationDto: PaginationDto, filterDto: FilterBlogDto) {
    const { id: userId } = this.request.user;

    const { pagination, blogs } =
      await this.findBlogsWithPaginationAndFiltering(
        paginationDto,
        filterDto,
        'blog."authorId" = :userId',
        { userId: userId },
      );

    return {
      pagination,
      blogs,
    };
  }

  async find(paginationDto: PaginationDto, filterDto: FilterBlogDto) {
    const { pagination, blogs } =
      await this.findBlogsWithPaginationAndFiltering(paginationDto, filterDto);

    return {
      pagination,
      blogs,
    };
  }

  async findOne(id: string | null, slug?: string) {
    const blog = await this.blogRepository.findOneBy({
      id: id ?? undefined,
      slug: slug ?? undefined,
      author: {
        status: EUserStatus.Active,
      },
    });

    if (!blog) {
      throw new NotFoundException(ENotFoundMessages.NotFound);
    }

    return blog;
  }

  async delete(id: string) {
    const blog = await this.findOne(id);

    await this.blogRepository.delete(blog);

    return {
      message: EPublicMessages.DeletedSuccessfully,
    };
  }

  async update(id: string, blogDto: UpdateBlogDto) {
    let { title, slug, description, content, time_to_read, image, categories } =
      blogDto;

    const blog = await this.findOne(id);

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

      const existBlog = await this.findOne(null, slug);
      if (existBlog && existBlog.id !== id) {
        blog.slug += `-${generateRandomID()}`;
      }
    }
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

  async toggleLike(blogId: string) {
    const { id: userId } = this.request.user;

    await this.findOne(blogId);
    const like = await this.blogLikeRepository.findOneBy({ userId, blogId });

    let message = like
      ? EPublicMessages.PostDislikedSuccessfully
      : EPublicMessages.PostLikedSuccessfully;

    if (like) {
      await this.blogLikeRepository.delete({ userId, blogId });
    } else {
      await this.blogLikeRepository.insert({
        userId,
        blogId,
      });
    }

    return {
      message,
    };
  }

  async toggleBookmark(blogId: string) {
    const { id: userId } = this.request.user;

    await this.findOne(blogId);
    const bookmark = await this.blogBookmarkRepository.findOneBy({
      userId,
      blogId,
    });

    let message = bookmark
      ? EPublicMessages.PostDisBookmarkedSuccessfully
      : EPublicMessages.PostBookmarkedSuccessfully;

    if (bookmark) {
      await this.blogBookmarkRepository.delete({ userId, blogId });
    } else {
      await this.blogBookmarkRepository.insert({
        userId,
        blogId,
      });
    }

    return {
      message,
    };
  }

  async findOneByID(id: string, paginationDto: PaginationDto) {
    const blog = await this.checkExistenceBlogByID(id, paginationDto);

    return blog;
  }

  async findOneBySlug(slug: string, paginationDto: PaginationDto) {
    const blog = await this.checkExistenceBlogBySlug(slug, paginationDto);
    if (!blog) {
      throw new NotFoundException(ENotFoundMessages.NotFound);
    }

    return blog;
  }

  async checkExistenceBlogBySlug(slug: string, paginationDto: PaginationDto) {
    const blog = await this.findOneBlog(
      'blog.slug = :slug',
      { slug },
      paginationDto,
    );

    return blog;
  }

  async checkExistenceBlogByID(id: string, paginationDto: PaginationDto) {
    if (!isUUID(id)) {
      throw new BadRequestException(EBadRequestMessages.InvalidID);
    }

    const blog = await this.findOneBlog('blog.id = :id', { id }, paginationDto);

    return blog;
  }

  async findOneBlog(
    where: string,
    parameters?: ObjectLiteral,
    paginationDto?: PaginationDto,
  ) {
    const userId = this.request?.user?.id;
    const roles = this.request?.user?.roles;

    const isAdmin = roles?.includes(ERole.Admin);

    const blog = await this.blogRepository
      .createQueryBuilder(EEntityName.Blog)
      .leftJoin('blog.categories', 'categories')
      .leftJoin('categories.category', 'category')
      .leftJoin('blog.author', 'author')
      .leftJoin('author.profile', 'profile')
      .addSelect([
        'categories.id',
        'category.title',
        'author.username',
        'author.status',
        'profile.nick_name',
      ])
      .where(where, parameters)
      .loadRelationCountAndMap('blog.likes', 'blog.likes')
      .loadRelationCountAndMap('blog.bookmarks', 'blog.bookmarks')
      .loadRelationCountAndMap(
        'blog.comments',
        'blog.comments',
        'comments',
        (qb) => {
          return qb.where('comments.accepted = :accepted', {
            accepted: true,
          });
        },
      )
      .getOne();

    if (!blog || (!isAdmin && blog.author.status === EUserStatus.Block)) {
      throw new NotFoundException(ENotFoundMessages.NotFound);
    }

    const {
      author: { status },
      ...newBlog
    } = blog;

    const blogId = blog.id;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const suggestedBlogs = await queryRunner.query(`
      WITH suggested_blogs AS (
        SELECT
            b.id,
            b.slug,
            b.title,
            b.description,
            b.time_to_read,
            b.image,
            json_build_object(
              'username', u.username,
              'nick_name', p.nick_name,
              'profile_image', p.profile_image
            ) AS author,
            array_agg(DISTINCT c.title) AS categories,
            (
              SELECT COUNT(*) FROM blog_like
              WHERE blog_like."blogId"::uuid = b.id::uuid
            ) AS likes,
            (
              SELECT COUNT(*) FROM blog_bookmark
              WHERE blog_bookmark."blogId"::uuid = b.id::uuid
            ) AS bookmarks,
            (
              SELECT COUNT(*) FROM blog_comment
              WHERE blog_comment."blogId"::uuid = b.id::uuid
            ) AS comments
        FROM blog b
        LEFT JOIN blog_category bc ON bc."blogId" = b.id  
        LEFT JOIN public.user u ON u.id = b."authorId" 
        LEFT JOIN profile p ON p.id = u."profileId" 
        LEFT JOIN category c ON c.id= bc."categoryId"  
        GROUP BY b.id, u.username, p.nick_name, p.profile_image
        ORDER BY RANDOM()
        LIMIT 4
      )
      SELECT * FROM suggested_blogs
    `);

    const isLiked = await this.blogLikeRepository.findOneBy({
      blogId,
      userId,
    });
    const isBookmarked = await this.blogBookmarkRepository.findOneBy({
      blogId,
      userId,
    });
    const comments = await this.commentService.commentListOfBlog(
      blogId,
      paginationDto!,
    );

    return {
      blog: newBlog,
      isLiked: isLiked ?? false,
      isBookmarked: isBookmarked ?? false,
      comments,
      suggestedBlogs,
    };
  }

  async findBlogsWithPaginationAndFiltering(
    paginationDto: PaginationDto,
    filterDto: FilterBlogDto,
    findWhere?: string,
    findWhereParameters: object = {},
  ) {
    const userRoles = this?.request?.user?.roles;
    const { page, limit, skip } = paginate(paginationDto);
    let { category, search } = filterDto;

    let where = 'author.status = :activeUser';

    if (userRoles && userRoles?.includes(ERole.Admin)) {
      where = '';
    }

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

    if (findWhere) {
      if (where.length > 0) where += ' AND ';
      where += findWhere;
    }

    const [blogs, count] = await this.blogRepository
      .createQueryBuilder(EEntityName.Blog)
      .leftJoin('blog.categories', 'categories')
      .leftJoin('categories.category', 'category')
      .leftJoin('blog.author', 'author')
      .leftJoin('author.profile', 'profile')
      .addSelect([
        'categories.id',
        'category.title',
        'author.username',
        'profile.nick_name',
      ])
      .where(where, {
        activeUser: EUserStatus.Active,
        category,
        search,
        ...findWhereParameters,
      })
      .loadRelationCountAndMap('blog.likes', 'blog.likes')
      .loadRelationCountAndMap('blog.bookmarks', 'blog.bookmarks')
      .loadRelationCountAndMap(
        'blog.comments',
        'blog.comments',
        'comments',
        (qb) => {
          return qb.where('comments.accepted = :accepted', { accepted: true });
        },
      )
      .orderBy('blog.created_at', 'DESC')
      .skip(skip)
      .limit(limit)
      .getManyAndCount();

    return {
      pagination: paginationData(count, page, limit),
      blogs,
    };
  }
}
