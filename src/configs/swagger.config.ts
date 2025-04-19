import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function SwaggerConfigInit(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Virgool')
    .setDescription('The backend of Virgool')
    .setVersion('v0.0.1')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger', app, documentFactory);
}
