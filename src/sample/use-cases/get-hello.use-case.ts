import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetHelloResponse } from '../sample-service-v1.inteface';

@Injectable()
export default class GetHelloUseCase {
  constructor(private configService: ConfigService) {}

  async execute(): Promise<GetHelloResponse> {
    const podName = this.configService.get('POD_NAME');
    return { message: 'Hello World!' + (podName ? ` From ${podName}` : '') };
  }
}
