import { Module, Global } from '@nestjs/common';
import { Context } from './context';

@Global()
@Module({
  providers: [Context],
  exports: [Context],
})
export class ContextModule {}
