import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';

import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EEntityName } from 'src/common/enums/entity.enum';
import { BlogEntity } from 'src/modules/blog/entities/blog.entity';
import { BlogBookmarkEntity } from 'src/modules/blog/entities/bookmark.entity';
import { BlogCommentEntity } from 'src/modules/blog/entities/comment.entity';
import { BlogLikeEntity } from 'src/modules/blog/entities/like.entity';
import { ImageEntity } from 'src/modules/image/entities/image.entity';

import { OTPEntity } from './otp.entity';
import { ProfileEntity } from './profile.entity';

@Entity(EEntityName.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  new_phone: string | null;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  new_email: string | null;

  @Column({ nullable: true, default: false })
  is_email_verified: boolean;

  @Column({ nullable: true, default: false })
  is_phone_verified: boolean;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  otpId: string;

  @Column({ nullable: true })
  profileId: string;

  @OneToOne(() => OTPEntity, (otp) => otp.user, { nullable: true })
  @JoinColumn()
  otp: OTPEntity;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
  @JoinColumn()
  profile: ProfileEntity;

  @OneToMany(() => BlogEntity, (blog) => blog.author, { nullable: true })
  blogs: BlogEntity[];

  @OneToMany(() => BlogLikeEntity, (like) => like.user, { nullable: true })
  blog_likes: BlogLikeEntity[];

  @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.user, {
    nullable: true,
  })
  blog_bookmarks: BlogBookmarkEntity[];

  @OneToMany(() => BlogCommentEntity, (comment) => comment.user, {
    nullable: true,
  })
  blog_comments: BlogCommentEntity[];

  @OneToMany(() => ImageEntity, (image) => image.user)
  images: ImageEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
