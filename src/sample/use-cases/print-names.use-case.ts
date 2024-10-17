import { Injectable } from '@nestjs/common';
import { PrintNamesResponse } from '../sample-service.inteface';
import { SampleRepository } from '../sample.repostory';

@Injectable()
export default class PrintNamesUseCase {
  constructor(private sampleRepository: SampleRepository) {}

  async execute(size: number, nameFilter: string): Promise<PrintNamesResponse> {
    const names = await this.sampleRepository.getNames(size, nameFilter);

    return { names };
  }
}
