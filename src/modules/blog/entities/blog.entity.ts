import { Column, Entity, OneToMany } from 'typeorm';

import { EEntityName } from 'src/common/enums/entity.enum';
import { BaseEntity } from 'src/common/abstracts/base.entity';

import { BlogLikeEntity } from './like.entity';
import { BlogBookmarkEntity } from './bookmark.entity';
import { BlogCommentEntity } from './comment.entity';

@Entity(EEntityName.Blog)
export class BlogEntity extends BaseEntity {
  @Column()
  status: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  time_to_read: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  authorId: string;

  @OneToMany(() => BlogLikeEntity, (like) => like.blog)
  likes: BlogLikeEntity[];

  @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.blog)
  bookmarks: BlogBookmarkEntity[];

  @OneToMany(() => BlogCommentEntity, (bookmark) => bookmark.blog)
  comments: BlogCommentEntity[];
}
