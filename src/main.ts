import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { SwaggerConfigInit } from './configs/swagger.config';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  SwaggerConfigInit(app);
  app.use(cookieParser(process.env.COOKIE_SECRET));

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}: http://localhost:${port}`);
    console.log(`Swagger: ${port}: http://localhost:${port}/swagger`);
  });
}
bootstrap();
