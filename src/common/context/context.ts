import { AsyncLocalStorage } from 'async_hooks';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Context {
  private storage;

  constructor() {
    this.storage = new AsyncLocalStorage();
  }
  get<T>(): T {
    return this.storage.getStore() as T;
  }

  runWith(context: unknown, cb: () => void): void {
    this.storage.run(context, cb);
  }
}
