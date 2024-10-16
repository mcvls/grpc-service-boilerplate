import { Module } from '@nestjs/common';
import { SampleController } from './sample.controller';
import GetHelloUseCase from './use-cases/get-hello.use-case';
import AddNameUseCase from './use-cases/add-name.use-case';
import PrintNamesUseCase from './use-cases/print-names.use-case';
import { SampleRepository } from './sample.repostory';

@Module({
  controllers: [SampleController],
  providers: [
    SampleRepository,
    GetHelloUseCase,
    AddNameUseCase,
    PrintNamesUseCase,
  ],
})
export class SampleModule {}
