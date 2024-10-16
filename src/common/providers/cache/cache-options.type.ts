import { ModuleMetadata } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';

const CACHE_CONFIG_OPTIONS = 'CACHE_CONFIG_OPTIONS';

interface CacheOptions {
  environment: string;
  host: string;
  port: number;
  username: string;
  password: string;
  db: number;
}

type CacheAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<CacheOptions>, 'useFactory' | 'inject'>;

export { CACHE_CONFIG_OPTIONS, CacheOptions, CacheAsyncOptions };
