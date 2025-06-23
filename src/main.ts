import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

export async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  
  app.enableCors({
  origin: [
    'https://studio.apollographql.com',
    'http://localhost:5173', // <--- AGREGA ESTA LÍNEA
    'http://localhost:3003',
  ],
  credentials: true,
  });

  const port = process.env.PORT || 3003;
  await app.listen(port);
  
  logger.log(`🚀 API Gateway corriendo en puerto ${port}`);
  logger.log(`🎯 GraphQL Playground: http://localhost:${port}/graphql`);
  logger.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();