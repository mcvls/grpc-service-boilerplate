import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  QueueAsyncOptions,
  QUEUE_CONFIG_OPTIONS,
  QueueOptions,
} from './queue-options.type';
import QueueService from './queue.service';

@Global()
@Module({
  providers: [],
  exports: [],
})
export class QueueModule {
  static forRoot(options: QueueOptions): DynamicModule {
    return {
      module: QueueModule,
      providers: [
        {
          provide: QUEUE_CONFIG_OPTIONS,
          useValue: options,
        },
        QueueService,
      ],
      exports: [QueueService],
    };
  }

  static forRootAsync(options: QueueAsyncOptions): DynamicModule {
    return {
      module: QueueModule,
      imports: options.imports,
      providers: [
        {
          provide: QUEUE_CONFIG_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        QueueService,
      ],
      exports: [QueueService],
    };
  }
}
