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
        console.log('VALIDATION ERRORS:', JSON.stringify(errors, null, 2));
        const formatError = (errs: any[]) => {
          return errs.map(err => {
            let msgs: string[] = [];
            if (err.constraints) {
              Object.entries(err.constraints).forEach(([key, value]: any) => {
                if (key === 'whitelistValidation') {
                  msgs.push(
                    `${err.property} талбар зөвшөөрөгдөөгүй байна.`,
                  );
                } else {
                  msgs.push(value);
                }
              });
            }
            if (err.children && err.children.length > 0) {
              msgs = [...msgs, ...formatError(err.children).split('\n')];
            }
            return msgs.join('\n');
          }).join('\n');
        }
        const message = formatError(errors);
        return new BadRequestException(message);
      },
    }),
  );

  console.log('process.env.PORT', process.env.PORT);
  await app.listen(process.env.PORT);
}
bootstrap();
