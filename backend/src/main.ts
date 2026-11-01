import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cho phép CORS kết nối từ Vite/React Frontend
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Tiền tố toàn cục cho API
  app.setGlobalPrefix('api');

  // Kiểm định dữ liệu đầu vào tự động
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`[Tự điển K'Ho API] Đang chạy tại cổng: http://localhost:${port}/api`);
}

bootstrap();
