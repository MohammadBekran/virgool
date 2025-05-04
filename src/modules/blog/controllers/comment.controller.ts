import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { API_BEARER_AUTH } from 'src/common/constants/bearer-auth.constant';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EAPITagsName } from 'src/common/enums/api-tag.enum';
import { EControllersName } from 'src/common/enums/controller.enum';
import { EEndpointKeys } from 'src/common/enums/endpoint-key.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

import { CreateCommentDto } from '../dto/comment.dto';
import { BlogCommentService } from '../services/comment.service';

@Controller(EControllersName.BlogComment)
@ApiTags(EAPITagsName.Blog)
@ApiBearerAuth(API_BEARER_AUTH)
@UseGuards(AuthGuard)
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @Post(EEndpointKeys.PostCreateComment)
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  create(@Body() commentDto: CreateCommentDto) {
    return this.blogCommentService.create(commentDto);
  }

  @Get(EEndpointKeys.GetFindComments)
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  @Pagination()
  find(@Query() paginationDto: PaginationDto) {
    return this.blogCommentService.find(paginationDto);
  }
}
