import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';

async function bootstrap() {
  const logger = new Logger('Main');
  ConfigModule.forRoot({ isGlobal: true });
  logger.log('Load .env file');

  const https = Boolean(process.env.USE_HTTPS);
  let app: INestApplication = null;

  if (https) {
    logger.log('Using https');
    const key = process.env.HTTPS_KEY;
    const cert = process.env.HTTPS_CERT;

    const httpsOptions = {
      key: fs.readFileSync(key),
      cert: fs.readFileSync(cert),
    };

    app = await NestFactory.create(AppModule, { httpsOptions });
  } else {
    app = await NestFactory.create(AppModule);
  }

  const useCors = Boolean(process.env.USE_CORS);
  if (useCors) {
    app.enableCors();
    logger.log('Enabled Cors');
  }

  const port = Number(process.env.PORT);
  logger.log(`API running on port: ${port}`);
  await app.listen(port);
}

bootstrap();
