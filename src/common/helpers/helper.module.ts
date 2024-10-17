import { Module, Global } from '@nestjs/common';
import { EncryptionHelper } from './encryption.helper';

@Global()
@Module({
  providers: [EncryptionHelper],
  exports: [EncryptionHelper],
})
export class HelperModule {}
