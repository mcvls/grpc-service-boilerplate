import {
  Inject,
  Injectable,
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
import { transports, format, createLogger, Logger } from 'winston';
import { KAFKA_CONFIG_OPTIONS, KafkaOptions } from './kafka-options.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class KafkaProducerService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private kafka: Kafka;
  private producer: Producer;
  private logger: Logger;
  constructor(
    @Inject(KAFKA_CONFIG_OPTIONS) private options: KafkaOptions,
    private configService: ConfigService,
    private context: Context,
  ) {
    const logDir = this.configService.get('LOG_DIR');
    const logFileName = this.configService.get('LOG_FILENAME');
    const serverId = this.configService.get('SERVER_ID') ?? 'localhost';
    this.context = context;
    this.logger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.DailyRotateFile({
          level: 'info',
          filename: `${logDir}/${logFileName}${
            serverId ? '-(' + serverId + ')' : ''
          }-%DATE%-producer.info`,
          extension: '.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
        new transports.DailyRotateFile({
          level: 'error',
          filename: `${logDir}/${logFileName}${
            serverId ? '-(' + serverId + ')' : ''
          }-%DATE%-producer.error`,
          extension: '.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
    const config: KafkaConfig = {
      clientId: this.options.clientId,
      brokers: this.options.brokers,
      logLevel: logLevel.ERROR,
      logCreator: () => {
        return ({ namespace, level, label, log }) => {
          switch (level) {
            case logLevel.ERROR:
            case logLevel.NOTHING:
              this.logger.error({ namespace, level, label, log } as any, {
                correlationId: this.context.get<any>()?.correlation_id,
              });
              break;
            case logLevel.WARN:
            case logLevel.INFO:
              this.logger.info({ namespace, level, label, log } as any, {
                correlationId: this.context.get<any>()?.correlation_id,
              });
              break;
            case logLevel.DEBUG:
              this.logger.debug({ namespace, level, label, log } as any, {
                correlationId: this.context.get<any>()?.correlation_id,
              });
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
