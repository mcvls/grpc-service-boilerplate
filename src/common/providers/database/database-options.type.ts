import { ModuleMetadata } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';

const DATABASE_CONFIG_OPTIONS = 'DATABASE_CONFIG_OPTIONS';

interface DatabaseOptions {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  connectionLimit: number;
}

type DatabaseAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<DatabaseOptions>, 'useFactory' | 'inject'>;

export { DATABASE_CONFIG_OPTIONS, DatabaseOptions, DatabaseAsyncOptions };
