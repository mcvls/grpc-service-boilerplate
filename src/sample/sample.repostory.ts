import { Injectable } from '@nestjs/common';
import CacheService from 'src/common/providers/cache/cache.service';

@Injectable()
export class SampleRepository {
  private readonly namesKey: string = 'SAMPLE_SERVICE_NAMES';

  constructor(private cacheService: CacheService) {}

  async addName(name: string) {
    let names: string[] = [];

    const cacheData = await this.cacheService.get(this.namesKey);
    if (cacheData) names = JSON.parse(cacheData) as string[];

    names.push(name);

    await this.cacheService.set(this.namesKey, JSON.stringify(names), 86400);
  }

  async checkNameExists(name: string) {
    let names: string[];

    const cacheData = await this.cacheService.get(this.namesKey);
    if (cacheData) names = JSON.parse(cacheData) as string[];
    else return false;

    return names.findIndex((x) => x == name) != -1;
  }

  async getNames(size: number, nameFilter: string) {
    let names: string[];

    const cacheData = await this.cacheService.get(this.namesKey);
    if (cacheData) names = JSON.parse(cacheData) as string[];
    else return [];

    names = names.filter((x) => !nameFilter || x.startsWith(nameFilter));
    names.length = names.length < size ? names.length : size;

    return names;
  }
}
