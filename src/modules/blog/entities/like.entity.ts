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

@Entity(EEntityName.BlogLike)
export class BlogLikeEntity extends BaseEntity {
  @Column()
  blogId: string;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.blog_likes, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => BlogEntity, (blog) => blog.likes, { onDelete: 'CASCADE' })
  blog: BlogEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
