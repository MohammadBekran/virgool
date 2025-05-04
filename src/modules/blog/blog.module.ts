import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { BlogEntity } from './entities/blog.entity';
import { BlogBookmarkEntity } from './entities/bookmark.entity';
import { BlogCommentEntity } from './entities/comment.entity';
import { BlogLikeEntity } from './entities/like.entity';

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
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService, CategoryService],
})
export class BlogModule {}
