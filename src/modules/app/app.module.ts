import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { TypeOrmConfig } from 'src/configs/typeorm.config';

import { AuthModule } from '../auth/auth.module';
import { BlogModule } from '../blog/blog.module';
import { CategoryModule } from '../category/category.module';
import { ImageModule } from '../image/image.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    UserModule,
    CategoryModule,
    BlogModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
