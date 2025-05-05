import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { FindOptionsWhere, IsNull, Repository } from 'typeorm';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  EBadRequestMessages,
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';
import { paginate, paginationData } from 'src/common/utils/pagination.util';

import { CreateCommentDto } from '../dto/comment.dto';
import { BlogCommentEntity } from '../entities/comment.entity';
import { BlogService } from './blog.service';

@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogCommentEntity)
    private blogCommentRepository: Repository<BlogCommentEntity>,
    @Inject(forwardRef(() => BlogService)) private blogService: BlogService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(commentDto: CreateCommentDto) {
    const { id: userId } = this.request.user;
    const { blogId, content, parentId } = commentDto;

    await this.blogService.findOne(blogId);

    let parent: BlogCommentEntity | null = null;
    if (parentId) {
      parent = await this.blogCommentRepository.findOneBy({
        id: parentId,
      });
    }

    await this.blogCommentRepository.insert({
      userId,
      blogId,
      content,
      accepted: false,
      parentId: parent ? parentId : undefined,
    });

    return {
      message: EPublicMessages.CommentCreated,
    };
  }

  async find(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginate(paginationDto);

    const [comments, count] = await this.getComments({}, skip, limit);

    return {
      pagination: paginationData(count, page, limit),
      comments,
    };
  }

  async findMyComments(paginationDto: PaginationDto) {
    const { id: userId } = this.request.user;
    const { page, limit, skip } = paginate(paginationDto);

    const [comments, count] = await this.getComments({ userId }, skip, limit);

    return {
      pagination: paginationData(count, page, limit),
      comments,
    };
  }

  async accept(id: string) {
    const comment = await this.checkExistenceCommentByID(id);

    if (comment.accepted) {
      throw new BadRequestException(EBadRequestMessages.CommentAlreadyAccepted);
    }

    comment.accepted = true;
    await this.blogCommentRepository.save(comment);

    return {
      message: EPublicMessages.UpdatedSuccessfully,
    };
  }

  async reject(id: string) {
    const comment = await this.checkExistenceCommentByID(id);

    if (!comment.accepted) {
      throw new BadRequestException(EBadRequestMessages.CommentAlreadyRejected);
    }

    comment.accepted = false;
    await this.blogCommentRepository.save(comment);

    return {
      message: EPublicMessages.UpdatedSuccessfully,
    };
  }

  async checkExistenceCommentByID(id: string) {
    const comment = await this.blogCommentRepository.findOneBy({
      id,
    });

    if (!comment) {
      throw new NotFoundException(ENotFoundMessages.NotFound);
    }

    return comment;
  }

  async getComments(
    where: FindOptionsWhere<BlogCommentEntity>,
    skip: number,
    limit: number,
  ) {
    return await this.blogCommentRepository.findAndCount({
      where,
      relations: {
        user: { profile: true },
        blog: true,
      },
      select: {
        user: {
          username: true,
          profile: {
            nick_name: true,
          },
        },
        blog: {
          title: true,
        },
      },
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });
  }

  async commentListOfBlog(blogId: string, paginationDto: PaginationDto) {
    const { page, limit, skip } = paginate(paginationDto);

    const [comments, count] = await this.blogCommentRepository.findAndCount({
      where: { blogId, parentId: IsNull() },
      relations: {
        user: { profile: true },
        replies: {
          user: { profile: true },
          replies: {
            user: { profile: true },
          },
        },
      },
      select: {
        user: {
          username: true,
          profile: {
            nick_name: true,
          },
        },
        replies: {
          content: true,
          parentId: true,
          created_at: true,
          user: {
            username: true,
            profile: {
              nick_name: true,
            },
          },
          replies: {
            content: true,
            parentId: true,
            created_at: true,
            user: {
              username: true,
              profile: {
                nick_name: true,
              },
            },
            replies: {
              content: true,
              parentId: true,
              created_at: true,
              user: {
                username: true,
                profile: {
                  nick_name: true,
                },
              },
            },
          },
        },
      },
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      pagination: paginationData(count, page, limit),
      comments,
    };
  }
}
