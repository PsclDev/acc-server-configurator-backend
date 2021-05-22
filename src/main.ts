import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');
  ConfigModule.forRoot({ isGlobal: true });
  logger.log('Load .env file');

  const port = Number(process.env.PORT);
  logger.log(`API running on port: ${port}`);
  await app.listen(port);
}

bootstrap();
