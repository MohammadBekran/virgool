import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';

import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EEntityName } from 'src/common/enums/entity.enum';

import { OTPEntity } from './otp.entity';
import { ProfileEntity } from './profile.entity';

@Entity(EEntityName.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  username: string;
  @Column({ unique: true, nullable: true })
  phone: string;
  @Column({ unique: true, nullable: true })
  email: string;
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
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
