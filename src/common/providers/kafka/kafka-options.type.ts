import { ModuleMetadata } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';

const KAFKA_CONFIG_OPTIONS = 'KAFKA_CONFIG_OPTIONS';

interface KafkaOptions {
  clientId: string;
  brokers: string[];
  username: string;
  password: string;
}

type KafkaAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<KafkaOptions>, 'useFactory' | 'inject'>;

export { KAFKA_CONFIG_OPTIONS, KafkaOptions, KafkaAsyncOptions };
