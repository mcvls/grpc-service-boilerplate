import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import {
  Kafka,
  KafkaConfig,
  Partitioners,
  Producer,
  ProducerRecord,
} from 'kafkajs';
import { KAFKA_CONFIG_OPTIONS, KafkaOptions } from './kafka-options.type';

@Injectable()
export default class KafkaProducerService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private kafka: Kafka;
  private producer: Producer;
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
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
  }

  async onApplicationBootstrap() {
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  async send(record: ProducerRecord) {
    await this.producer.send(record);
  }
}
