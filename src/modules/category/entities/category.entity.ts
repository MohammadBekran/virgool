import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EEntityName } from 'src/common/enums/entity.enum';
import { BlogCategoryEntity } from 'src/modules/blog/entities/blog-category.entity';

@Entity(EEntityName.Category)
export class CategoryEntity extends BaseEntity {
  @Column()
  title: string;
  @Column({ nullable: true })
  priority: number;
  @OneToMany(() => BlogCategoryEntity, (category) => category.category)
  blog_categories: BlogCategoryEntity[];
}
