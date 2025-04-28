import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function SwaggerConfigInit(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Virgool')
    .setDescription('The backend of Virgool')
    .setVersion('v0.0.1')
    .addBearerAuth(SwaggerAuthConfig(), 'Authorization')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger', app, documentFactory);
}

function SwaggerAuthConfig(): SecuritySchemeObject {
  return {
    type: 'http',
    bearerFormat: 'JWT',
    in: 'header',
    scheme: 'bearer',
  };
}
