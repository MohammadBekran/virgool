import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EAPITagsName } from 'src/common/enums/api-tag.enum';
import { EControllersName } from 'src/common/enums/controller.enum';
import { EEndpointKeys } from 'src/common/enums/endpoint-key.enum';
import { ESwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

import { CreateCommentDto } from '../dto/comment.dto';
import { BlogCommentService } from '../services/comment.service';

@Controller(EControllersName.BlogComment)
@ApiTags(EAPITagsName.Blog)
@AuthDecorator()
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @Post(EEndpointKeys.PostCreateComment)
  @ApiConsumes(ESwaggerConsumes.UrlEncoded, ESwaggerConsumes.JSON)
  create(@Body() commentDto: CreateCommentDto) {
    return this.blogCommentService.create(commentDto);
  }

  @Get(EEndpointKeys.GetFindComments)
  @Pagination()
  find(@Query() paginationDto: PaginationDto) {
    return this.blogCommentService.find(paginationDto);
  }

  @Get(EEndpointKeys.GetFindMyComments)
  @Pagination()
  findMyComments(@Query() paginationDto: PaginationDto) {
    return this.blogCommentService.findMyComments(paginationDto);
  }

  @Patch(EEndpointKeys.PatchAcceptComment)
  accept(@Param('id') id: string) {
    return this.blogCommentService.accept(id);
  }

  @Patch(EEndpointKeys.PatchRejectComment)
  reject(@Param('id') id: string) {
    return this.blogCommentService.reject(id);
  }
}
