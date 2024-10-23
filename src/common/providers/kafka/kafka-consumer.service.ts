import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { KAFKA_CONFIG_OPTIONS, KafkaOptions } from './kafka-options.type';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
  KafkaConfig,
} from 'kafkajs';

@Injectable()
export default class KafkaConsumerService implements OnApplicationShutdown {
  private kafka: Kafka;
  private consumers: Consumer[] = [];
  constructor(@Inject(KAFKA_CONFIG_OPTIONS) private options: KafkaOptions) {
    const config: KafkaConfig = {
      clientId: this.options.clientId,
      brokers: this.options.brokers,
    };
    if (this.options.username && this.options.password) {
      config.ssl = true;
      config.sasl = {
        mechanism: 'scram-sha-512',
        username: this.options.username,
        password: this.options.password,
      };
    }
    this.kafka = new Kafka(config);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) await consumer.disconnect();
  }

  async consume(topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({ groupId: 'test_group_001' });
    await consumer.connect();
    await consumer.subscribe(topics);
    await consumer.run(config);
    this.consumers.push(consumer);
  }
}
