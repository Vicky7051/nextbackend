import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        // Generate a random ID and set it as a cookie
        const randomId = uuidv4();
        console.log("Next Id =>", randomId);
        response.cookie('randomId', randomId, {
          httpOnly: true,    // Ensures the cookie is only accessible by the web server
          secure: process.env.NODE_ENV === 'production', // Secure cookies in production
          maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
        });
      }),
    );
  }
}
