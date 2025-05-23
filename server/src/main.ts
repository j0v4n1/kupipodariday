import 'dotenv/config';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  if (process.env.IS_TS_NODE) {
    app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
    });
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap().then(() =>
  console.log(`Server started on port ${process.env.PORT}`),
);
