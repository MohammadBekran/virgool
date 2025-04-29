import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';

import { EAPITagsName } from 'src/common/enums/api-tag.enum';
import { EControllersName } from 'src/common/enums/controller.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Pagination } from 'src/common/decorators/pagination.decorator';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller(EControllersName.Category)
@ApiTags(EAPITagsName.Category)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
