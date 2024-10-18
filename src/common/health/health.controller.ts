import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import {
  HealthCheckRequest,
  HealthCheckResposne,
  ServingStatus,
} from './health.inteface';

@Controller()
export class HealthController {
  @GrpcMethod('Health', 'Check')
  check(data: HealthCheckRequest, metadata: any): HealthCheckResposne {
    return { status: ServingStatus.SERVING };
  }
}
