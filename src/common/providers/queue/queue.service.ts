import { Inject, Injectable, Logger } from '@nestjs/common';
import client, { Connection } from 'amqplib';
import { QueueOptions } from './queue-options.type';
import { QUEUE_CONFIG_OPTIONS } from './queue-options.type';

@Injectable()
export default class QueueService {
  private connectionPromise: Promise<Connection>;
  private connection: Connection;
  private channel: client.Channel;

  constructor(@Inject(QUEUE_CONFIG_OPTIONS) private options: QueueOptions) {
    this.connectionPromise = client
      .connect({
        protocol: this.options.protocol,
        hostname: this.options.hostname,
        username: this.options.username,
        password: this.options.password,
      })
      .catch((error) => {
        throw error;
      });
  }

  async sendToQueue(queueName: string, message: string): Promise<boolean> {
    if (!this.connection) {
      this.connection = await this.connectionPromise;
      this.connection.on('error', (error) => {
        this.connection.close();
        throw error;
      });
    }
    if (!this.channel) {
      this.channel = await this.connection.createChannel();
      this.channel.on('error', (error) => {
        this.channel.close();
        this.connection.close();
        throw error;
      });
    }
    await this.channel.assertQueue(queueName, { durable: true });
    return this.channel.sendToQueue(queueName, Buffer.from(message), {
      contentType: 'application/json',
    });
  }
}
