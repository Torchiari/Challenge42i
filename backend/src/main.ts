import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService);

  const port = config.get<number>('PORT') || 3000;
  const prefix = config.get<string>('API_PREFIX') || 'api';

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix(prefix);

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/${prefix}`);
}
bootstrap();
