import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EEntityName } from 'src/common/enums/entity.enum';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';

import { BlogEntity } from './blog.entity';

@Entity(EEntityName.BlogCategory)
export class BlogCategoryEntity extends BaseEntity {
  @Column()
  blogId: string;
  @Column()
  categoryId: string;
  @ManyToOne(() => BlogEntity, (blog) => blog.categories)
  blog: BlogEntity;
  @ManyToOne(() => CategoryEntity, (category) => category.blog_categories)
  category: CategoryEntity;
}
