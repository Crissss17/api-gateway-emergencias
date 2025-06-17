import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // Configurar validación global
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,
  //   transform: true,
  //   forbidNonWhitelisted: false,
  // }));

  // Habilitar CORS para el frontend
  app.enableCors({
    origin: [
      'https://studio.apollographql.com',
      //'https://6768-179-8-40-26.ngrok-free.app', // o tu dominio ngrok actual
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