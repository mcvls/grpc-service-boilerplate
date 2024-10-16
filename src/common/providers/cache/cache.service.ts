import { Inject, Injectable, Logger } from '@nestjs/common';
import { CacheOptions } from './cache-options.type';
import { CACHE_CONFIG_OPTIONS } from './cache-options.type';
import { Redis, Cluster } from 'ioredis';

@Injectable()
export default class CacheService {
  private cacheConn: Redis | Cluster;

  constructor(@Inject(CACHE_CONFIG_OPTIONS) private options: CacheOptions) {
    if (this.options.environment === 'development') {
      this.cacheConn = new Redis({
        port: this.options.port,
        host: this.options.host,
        username: this.options.username,
        password: this.options.password,
        db: this.options.db,
      });
    } else {
      this.cacheConn = new Cluster(
        [{ host: this.options.host, port: this.options.port }],
        {
          slotsRefreshTimeout: 10000,
          dnsLookup: (address, callback) => callback(null, address),
          redisOptions: {
            username: this.options.username,
            password: this.options.password,
            db: this.options.db,
          },
        },
      );
    }

    this.cacheConn.on('connect', () => {
      Logger.log('Connected to redis server');
    });

    this.cacheConn.on('close', () => {
      Logger.log('Redis connection closed attempting reconnect');
      this.cacheConn.connect();
    });

    this.cacheConn.on('error', (error) => {
      throw error;
    });
  }

  async set(key: string, value: string, seconds: number): Promise<boolean> {
    const res = await this.cacheConn.set(key, value, 'EX', seconds);
    return res === 'OK';
  }

  async get(key: string): Promise<string> {
    return await this.cacheConn.get(key);
  }

  async del(key: string): Promise<boolean> {
    await this.cacheConn.del([key]);
    return true;
  }
}
