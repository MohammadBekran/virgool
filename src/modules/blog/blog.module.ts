import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { BlogController } from './controllers/blog.controller';
import { BlogCommentController } from './controllers/comment.controller';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { BlogEntity } from './entities/blog.entity';
import { BlogBookmarkEntity } from './entities/bookmark.entity';
import { BlogCommentEntity } from './entities/comment.entity';
import { BlogLikeEntity } from './entities/like.entity';
import { BlogService } from './services/blog.service';
import { BlogCommentService } from './services/comment.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      BlogEntity,
      BlogLikeEntity,
      BlogBookmarkEntity,
      BlogCommentEntity,
      BlogCategoryEntity,
      CategoryEntity,
      BlogLikeEntity,
      BlogBookmarkEntity,
      BlogCommentEntity,
    ]),
  ],
  controllers: [BlogController, BlogCommentController],
  providers: [BlogService, CategoryService, BlogCommentService],
})
export class BlogModule {}
