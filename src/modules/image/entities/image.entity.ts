import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EEntityName } from 'src/common/enums/entity.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Entity(EEntityName.Image)
export class ImageEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  alt: string;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.images)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @CreateDateColumn()
  created_at: Date;
}
