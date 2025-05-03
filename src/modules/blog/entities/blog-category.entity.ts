import { Entity } from 'typeorm';

import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EEntityName } from 'src/common/enums/entity.enum';

@Entity(EEntityName.BlogCategory)
export class BlogCategoryEntity extends BaseEntity {}
