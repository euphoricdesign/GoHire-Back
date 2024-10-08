import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();
const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'https://go-hire-app.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });  

  const swaggerConfig = new DocumentBuilder()
    .setTitle('EaseHire')
    .setDescription('Proyecto Final "Soy Henry"')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  app.useGlobalPipes(new ValidationPipe());
  SwaggerModule.setup('api', app, document);
  // Configura el servidor para escuchar en 0.0.0.0
  await app.listen(port, '0.0.0.0');
}
bootstrap();
