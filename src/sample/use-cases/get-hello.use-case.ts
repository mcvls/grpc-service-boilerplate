import { Injectable } from '@nestjs/common';
import { GetHelloResponse } from '../sample-service.inteface';

@Injectable()
export default class GetHelloUseCase {
  constructor() {}

  async execute(): Promise<GetHelloResponse> {
    return { message: 'Hello World!' };
  }
}
