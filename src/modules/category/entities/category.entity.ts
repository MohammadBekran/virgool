import { Column, Entity } from 'typeorm';

import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EEntityName } from 'src/common/enums/entity.enum';

@Entity(EEntityName.Category)
export class CategoryEntity extends BaseEntity {
  @Column()
  title: string;
  @Column({ nullable: true })
  priority: number;
}
