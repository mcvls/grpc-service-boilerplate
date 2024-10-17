import { ModuleMetadata } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';

const QUEUE_CONFIG_OPTIONS = 'QUEUE_CONFIG_OPTIONS';

interface QueueOptions {
  protocol: string;
  hostname: string;
  username: string;
  password: string;
}

type QueueAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<QueueOptions>, 'useFactory' | 'inject'>;

export { QUEUE_CONFIG_OPTIONS, QueueOptions, QueueAsyncOptions };
