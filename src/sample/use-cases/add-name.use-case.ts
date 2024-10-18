import { Injectable } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { AppRpcException } from 'src/common/exceptions/app-rpc.exception';
import { SampleRepository } from '../sample.repostory';
import { AddNameResponse } from '../sample-service-v1.inteface';

@Injectable()
export default class AddNameUseCase {
  constructor(private sampleRepository: SampleRepository) {}

  async execute(name: string): Promise<AddNameResponse> {
    if (await this.sampleRepository.checkNameExists(name))
      throw new AppRpcException(
        'name already exists',
        'name already exists',
        status.INVALID_ARGUMENT,
        true,
      );

    this.sampleRepository.addName(name);

    return { message: `${name} has been added` };
  }
}
