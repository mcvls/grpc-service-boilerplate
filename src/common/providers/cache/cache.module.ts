import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  CacheAsyncOptions,
  CACHE_CONFIG_OPTIONS,
  CacheOptions,
} from './cache-options.type';
import CacheService from './cache.service';

@Global()
@Module({
  providers: [],
  exports: [],
})
export class CacheModule {
  static forRoot(options: CacheOptions): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        {
          provide: CACHE_CONFIG_OPTIONS,
          useValue: options,
        },
        CacheService,
      ],
      exports: [CacheService],
    };
  }

  static forRootAsync(options: CacheAsyncOptions): DynamicModule {
    return {
      module: CacheModule,
      imports: options.imports,
      providers: [
        {
          provide: CACHE_CONFIG_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        CacheService,
      ],
      exports: [CacheService],
    };
  }
}
