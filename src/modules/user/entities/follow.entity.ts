import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EEntityName } from 'src/common/enums/entity.enum';

import { UserEntity } from './user.entity';

@Entity(EEntityName.Follow)
export class FollowEntity extends BaseEntity {
  @Column()
  followingId: string;

  @Column()
  followerId: string;

  @ManyToOne(() => UserEntity, (user) => user.followers, {
    onDelete: 'CASCADE',
  })
  following: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.followings, {
    onDelete: 'CASCADE',
  })
  follower: UserEntity;

  @CreateDateColumn()
  created_at: Date;
}
