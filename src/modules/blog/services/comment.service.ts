import { Inject, Injectable, Post, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { CreateCommentDto } from '../dto/comment.dto';
import { BlogCommentEntity } from '../entities/comment.entity';
import { BlogService } from './blog.service';
import { EPublicMessages } from 'src/common/enums/message.enum';

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
      parentId: parent ? parentId : undefined,
    });

    return {
      message: EPublicMessages.CommentCreated,
    };
  }
}
