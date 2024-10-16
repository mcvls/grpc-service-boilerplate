import {
  Injectable,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { AppRpcException } from '../exceptions/app-rpc.exception';

@Injectable()
export class RpcValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      ...options,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const validationMessages = this.getAllConstraints(validationErrors);
        return new AppRpcException(
          validationMessages,
          validationMessages,
          status.INVALID_ARGUMENT,
          true,
        );
      },
    });
  }

  getAllConstraints(errors: ValidationError[]): string[] {
    const constraints: string[] = [];

    for (const error of errors) {
      if (error.constraints) {
        const constraintValues = Object.values(error.constraints);
        constraints.push(...constraintValues);
      }

      if (error.children) {
        const childConstraints = this.getAllConstraints(error.children);
        constraints.push(...childConstraints);
      }
    }

    return constraints;
  }
}
