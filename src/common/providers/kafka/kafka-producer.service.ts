import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import {
  Kafka,
  KafkaConfig,
  logLevel,
  Partitioners,
  Producer,
  ProducerRecord,
} from 'kafkajs';
import { Context } from 'src/common/context/context';
import { KAFKA_CONFIG_OPTIONS, KafkaOptions } from './kafka-options.type';

@Injectable()
export default class KafkaProducerService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private kafka: Kafka;
  private producer: Producer;
  constructor(
    @Inject(KAFKA_CONFIG_OPTIONS) private options: KafkaOptions,
    private context: Context,
  ) {
    const config: KafkaConfig = {
      clientId: this.options.clientId,
      brokers: this.options.brokers,
      logLevel: logLevel.ERROR,
      logCreator: () => {
        return ({ namespace, level, label, log }) => {
          switch (level) {
            case logLevel.ERROR:
            case logLevel.NOTHING:
              Logger.error({ namespace, level, label, log } as any, 'producer');
              break;
            case logLevel.WARN:
            case logLevel.INFO:
              Logger.log({ namespace, level, label, log } as any, 'producer');
              break;
            case logLevel.DEBUG:
              Logger.debug({ namespace, level, label, log } as any, 'producer');
              break;
          }
        };
      },
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
    const correlationId = this.context.get<any>()?.correlation_id;
    record.messages.forEach((x) => {
      x.headers = { ...x.headers, 'x-correlation-id': correlationId };
    });
    await this.producer.send(record);
  }
}
