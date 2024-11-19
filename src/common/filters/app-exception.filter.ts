import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { AppRpcException } from '../exceptions/app-rpc.exception';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';
import { ServerUnaryCall, ServerWritableStream, status } from '@grpc/grpc-js';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    let untrustedException = false;
    let throwable: any;
    if (exception instanceof AppRpcException) {
      const appException = exception as AppRpcException;
      if (appException.sendToLog)
        Logger.error(
          exception.internalMessage,
          undefined,
          exception.stack.toString(),
        );
      untrustedException = !appException.isOperational;
      throwable = {
        code: exception.status,
        message: exception.externalMessage,
      };
    } else if (exception instanceof RpcException) {
      Logger.error(exception.message, undefined, exception.stack.toString());
      exception = exception as any;
      throwable = {
        code: exception.error?.code ?? status.UNKNOWN,
        message: exception.error?.message,
      };
    } else {
      Logger.error(exception.message, undefined, exception.stack.toString());
      throwable = {
        code: status.INTERNAL,
        message: 'Unexpected error occurred',
      };
      untrustedException = true;
    }

    if (untrustedException) {
      Logger.error(
        `Untrusted exception occured, signaling app for termination`,
      );
      process.kill(process.pid, 'SIGTERM');
    }

    return throwError(() => throwable);
  }
}
