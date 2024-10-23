import { Module } from '@nestjs/common';
import { SampleRepository } from './sample.repostory';
import { SampleController } from './sample.controller';
import GetHelloUseCase from './use-cases/get-hello.use-case';
import AddNameUseCase from './use-cases/add-name.use-case';
import PrintNamesUseCase from './use-cases/print-names.use-case';
import ProduceEventUseCase from './use-cases/produce-event.use-case';
import SampleConsumer from './consumers/sample.consumer';

@Module({
  controllers: [SampleController],
  providers: [
    SampleRepository,
    GetHelloUseCase,
    AddNameUseCase,
    PrintNamesUseCase,
    ProduceEventUseCase,
    SampleConsumer,
  ],
})
export class SampleModule {}
