import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Context } from '../context/context';
import { randomUUID } from 'crypto';

@Injectable()
//Custom Correlation Handler, if need on a higher level, create custom Guard
export class CorrelationInterceptor implements NestInterceptor {
  constructor(private context: Context) {}

  intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const context = ctx.switchToRpc().getContext();
    const requestCorrelationIdObj =
      context?.internalRepr?.get('x-correlation-id');
    let requestCorrelationId;

    if (requestCorrelationIdObj) {
      requestCorrelationId = Array.isArray(requestCorrelationIdObj)
        ? requestCorrelationIdObj[0]
        : String(requestCorrelationIdObj);
    }
    const store = {
      correlation_id: requestCorrelationId ?? randomUUID(),
    };

    return new Observable((observer) => {
      this.context.runWith(store, () => {
        next.handle().subscribe({
          next: (res) => observer.next(res),
          error: (error) => observer.error(error),
          complete: () => observer.complete(),
        });
      });
    });
  }
}
