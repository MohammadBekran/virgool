import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EEntityName } from 'src/common/enums/entity.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';

import { BlogEntity } from './blog.entity';

@Entity(EEntityName.BlogComment)
export class BlogCommentEntity extends BaseEntity {
  @Column()
  blogId: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  parentId: string;

  @Column()
  content: string;

  @Column({ type: 'boolean', default: false })
  accepted: boolean;

  @ManyToOne(() => UserEntity, (user) => user.blog_comments, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
  @ManyToOne(() => BlogEntity, (blog) => blog.comments, {
    onDelete: 'CASCADE',
  })
  blog: BlogEntity;
  @ManyToOne(() => BlogCommentEntity, (parent) => parent.replies, {
    onDelete: 'CASCADE',
  })
  parent: BlogCommentEntity;

  @OneToMany(() => BlogCommentEntity, (comment) => comment.parent)
  @JoinColumn({ name: 'parent' })
  replies: BlogCommentEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
