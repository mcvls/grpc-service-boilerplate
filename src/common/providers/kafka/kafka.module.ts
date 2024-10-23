import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  KAFKA_CONFIG_OPTIONS,
  KafkaAsyncOptions,
  KafkaOptions,
} from './kafka-options.type';
import KafkaProducerService from './kafka-producer.service';
import KafkaConsumerService from './kafka-consumer.service';

@Global()
@Module({
  providers: [],
  exports: [],
})
export class KafkaModule {
  static forRoot(options: KafkaOptions): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        {
          provide: KAFKA_CONFIG_OPTIONS,
          useValue: options,
        },
        KafkaProducerService,
        KafkaConsumerService,
      ],
      exports: [KafkaProducerService, KafkaConsumerService],
    };
  }

  static forRootAsync(options: KafkaAsyncOptions): DynamicModule {
    return {
      module: KafkaModule,
      imports: options.imports,
      providers: [
        {
          provide: KAFKA_CONFIG_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        KafkaProducerService,
        KafkaConsumerService,
      ],
      exports: [KafkaProducerService, KafkaConsumerService],
    };
  }
}
