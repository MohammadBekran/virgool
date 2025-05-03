import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EEntityName } from 'src/common/enums/entity.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';

import { BlogEntity } from './blog.entity';

@Entity(EEntityName.BlogBookmark)
export class BlogBookmarkEntity extends BaseEntity {
  @Column()
  blogId: string;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.blog_bookmarks, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
  @ManyToOne(() => BlogEntity, (blog) => blog.bookmarks, {
    onDelete: 'CASCADE',
  })
  blog: BlogEntity;
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
