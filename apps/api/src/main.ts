import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { buildCorsOptions } from './common/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet());
  app.use(cookieParser());

  // Robust CORS — supports comma-separated list and wildcard origins
  // (e.g. CORS_ORIGIN="https://my-app.vercel.app,https://*.vercel.app").
  app.enableCors(buildCorsOptions(config.get<string>('CORS_ORIGIN')));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = config.get<number>('PORT', 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API ready on http://localhost:${port}/api`);
}

bootstrap();
