import { Injectable } from '@nestjs/common';
import { GetHelloResponse } from '../sample-service-v1.inteface';

@Injectable()
export default class GetHelloUseCase {
  constructor() {}

  async execute(): Promise<GetHelloResponse> {
    return { message: 'Hello World!' };
  }
}
