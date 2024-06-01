import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const dt = Date.now();
    return next.handle().pipe(
      tap(() => {
        // console.log('event: ', event);
        const request = context.switchToHttp().getRequest();
        console.log(
          'Execução levou: ',
          Date.now() - dt,
          'milissegundos.',
          request.method,
          request.url,
        );
      }),
    );
  }
}
