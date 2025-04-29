import { Column, Entity, OneToOne } from 'typeorm';

import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EEntityName } from 'src/common/enums/entity.enum';

import { UserEntity } from './user.entity';

@Entity(EEntityName.Profile)
export class ProfileEntity extends BaseEntity {
  @Column()
  nick_name: string;
  @Column({ nullable: true })
  biography: string;
  @Column({ nullable: true })
  profile_image: string;
  @Column({ nullable: true })
  background_image: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  birthday: Date;
  @Column({ nullable: true })
  linkedin_profile: string;
  @Column({ nullable: true })
  x_profile: string;
  @Column()
  userId: string;
  @OneToOne(() => UserEntity, (user) => user.profile, { onDelete: 'CASCADE' })
  user: UserEntity;
}
