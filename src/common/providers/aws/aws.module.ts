import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  AWSAsyncOptions,
  AWS_CONFIG_OPTIONS,
  AWSOptions,
} from './aws-options.type';
import AWSService from './aws.service';

@Global()
@Module({
  providers: [],
  exports: [],
})
export class AWSModule {
  static forRoot(options: AWSOptions): DynamicModule {
    return {
      module: AWSModule,
      providers: [
        {
          provide: AWS_CONFIG_OPTIONS,
          useValue: options,
        },
        AWSService,
      ],
      exports: [AWSService],
    };
  }

  static forRootAsync(options: AWSAsyncOptions): DynamicModule {
    return {
      module: AWSModule,
      imports: options.imports,
      providers: [
        {
          provide: AWS_CONFIG_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        AWSService,
      ],
      exports: [AWSService],
    };
  }
}
