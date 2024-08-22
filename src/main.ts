import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = {
    origin: true,  // Replace with your actual frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
    // origin: 'https://nextfrontend-1dnu.onrender.com',
    // credentials: true,
  };
  app.enableCors(options)
  app.use(cookieParser())
  await app.listen(4000);
}
bootstrap();
