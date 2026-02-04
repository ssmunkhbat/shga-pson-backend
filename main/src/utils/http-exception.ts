import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Алдаа гарлаа';

    // NestJS HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || message;
    } else if (exception instanceof QueryFailedError) { // TypeORM / Oracle алдаа
      status = HttpStatus.INTERNAL_SERVER_ERROR;

      const errMsg = (exception as any).message as string;
      message = errMsg; // бусад Oracle алдаа
    }

    response.status(status).json({
      status,
      message,
    });
  }
}
