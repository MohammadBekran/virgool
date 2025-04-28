import { UserEntity } from './user.entity';
import { BaseEntity } from 'src/common/abstracts/base.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { EEntityName } from 'src/common/enums/entity.enum';

@Entity(EEntityName.OTP)
export class OTPEntity extends BaseEntity {
  @Column()
  code: string;
  @Column()
  expiresIn: Date;
  @Column()
  userId: string;
  @OneToOne(() => UserEntity, (user) => user.otp, { onDelete: 'CASCADE' })
  user: UserEntity;
}
