import { Inject, Injectable, Post, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EPublicMessages } from 'src/common/enums/message.enum';

import { CreateCommentDto } from '../dto/comment.dto';
import { BlogCommentEntity } from '../entities/comment.entity';
import { BlogService } from './blog.service';
import { paginate, paginationData } from 'src/common/utils/pagination.util';

@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogCommentEntity)
    private blogCommentRepository: Repository<BlogCommentEntity>,
    private blogService: BlogService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(commentDto: CreateCommentDto) {
    const { id: userId } = this.request.user;
    const { blogId, content, parentId } = commentDto;

    await this.blogService.checkExistenceBlogByID(blogId);

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
    const { id: userId } = this.request.user;
    const { page, limit, skip } = paginate(paginationDto);

    const [comments, count] = await this.blogCommentRepository.findAndCount({
      where: { userId },
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

    return {
      pagination: paginationData(count, page, limit),
      comments,
    };
  }
}
