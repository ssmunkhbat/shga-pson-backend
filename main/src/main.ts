import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const message = errors
          .map(err => {
            // DTO-д байхгүй field
            if (err.constraints?.whitelistValidation) {
              return `${err.property}: Талбар байхгүй байна`;
            }
            // Бусад validation
            return Object.values(err.constraints ?? {}).map(
              msg => `${err.property}: ${msg}`,
            );
          }).flat().join('\n');
        return new BadRequestException(message);
      },
    }),
  );

  console.log('process.env.PORT', process.env.PORT)
  await app.listen(process.env.PORT);
}
bootstrap();
