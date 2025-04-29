import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), AuthModule, UserModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
