import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  EConflictMessages,
  ENotFoundMessages,
  EPublicMessages,
} from 'src/common/enums/message.enum';
import { paginate, paginationData } from 'src/common/utils/pagination.util';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { title, priority } = createCategoryDto;

    const category = this.categoryRepository.create({
      title,
      priority,
    });
    await this.categoryRepository.save(category);

    return {
      message: EPublicMessages.CreatedSuccessfully,
    };
  }

  async createByTitle(title: string) {
    const category = this.categoryRepository.create({
      title,
    });

    return await this.categoryRepository.save(category);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginate(paginationDto);

    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      take: limit,
      skip,
    });

    return {
      pagination: paginationData(count, page, limit),
      categories,
    };
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(ENotFoundMessages.NotFound);
    }

    return category;
  }

  async findOneByTitle(title: string) {
    const category = await this.categoryRepository.findOneBy({ title });

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    const { title, priority } = updateCategoryDto;

    if (title) category.title = title;
    if (priority) category.priority = priority;

    await this.categoryRepository.save(category);

    return {
      message: EPublicMessages.UpdatedSuccessfully,
    };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.categoryRepository.delete({ id });

    return {
      message: EPublicMessages.DeletedSuccessfully,
    };
  }

  async checkExistenceCategoryByTitle(title: string) {
    title = title?.trim().toLowerCase();

    const category = await this.categoryRepository.findOneBy({
      title,
    });
    if (category) {
      throw new ConflictException(EConflictMessages.CategoryAlreadyExists);
    }

    return category;
  }
}
