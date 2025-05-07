import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { FilterBlog } from 'src/common/decorators/filter.decorator';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EAPITagsName } from 'src/common/enums/api-tag.enum';
import { EControllersName } from 'src/common/enums/controller.enum';
import { EEndpointKeys } from 'src/common/enums/endpoint-key.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { BlogService } from '../services/blog.service';

@Controller(EControllersName.Blog)
@ApiTags(EAPITagsName.Blog)
@AuthDecorator()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post(EEndpointKeys.PostCreateBlog)
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  create(@Body() blogDto: CreateBlogDto) {
    return this.blogService.create(blogDto);
  }

  @Get(EEndpointKeys.GetMyBlogs)
  getMyBlogs() {
    return this.blogService.getMyBlogs();
  }

  @Get(EEndpointKeys.GetBlogs)
  @SkipAuth()
  @Pagination()
  @FilterBlog()
  find(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterBlogDto,
  ) {
    return this.blogService.find(paginationDto, filterDto);
  }

  @Get(EEndpointKeys.GetBlogByID)
  @SkipAuth()
  @Pagination()
  findOneByID(@Param('id') id: string, @Query() paginationDto: PaginationDto) {
    return this.blogService.findOneByID(id, paginationDto);
  }

  @Get(EEndpointKeys.GetBlogBySlug)
  @SkipAuth()
  @Pagination()
  findOneBySlug(
    @Param('slug') slug: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.blogService.findOneBySlug(slug, paginationDto);
  }

  @Delete(EEndpointKeys.DeleteBlog)
  delete(@Param('id') id: string) {
    return this.blogService.delete(id);
  }

  @Put(EEndpointKeys.PutUpdateBlog)
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  update(@Param('id') id: string, @Body() blogDto: UpdateBlogDto) {
    return this.blogService.update(id, blogDto);
  }

  @Get(EEndpointKeys.GetToggleLike)
  toggleLike(@Param('id') id: string) {
    return this.blogService.toggleLike(id);
  }

  @Get(EEndpointKeys.GetToggleBookmark)
  toggleBookmark(@Param('id') id: string) {
    return this.blogService.toggleBookmark(id);
  }
}
