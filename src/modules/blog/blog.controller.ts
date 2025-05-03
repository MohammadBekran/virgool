import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { EControllersName } from 'src/common/enums/controller.enum';
import { EAPITagsName } from 'src/common/enums/api-tag.enum';
import { EEndpointKeys } from 'src/common/enums/endpoint-key.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { API_BEARER_AUTH } from 'src/common/constants/bearer-auth.constant';

import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/blog.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller(EControllersName.Blog)
@ApiTags(EAPITagsName.Blog)
@UseGuards(AuthGuard)
@ApiBearerAuth(API_BEARER_AUTH)
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
}
