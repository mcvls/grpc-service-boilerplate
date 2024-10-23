import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import KafkaConsumerService from 'src/common/providers/kafka/kafka-consumer.service';

@Injectable()
export default class SampleConsumer implements OnApplicationBootstrap {
  constructor(private kafkaConsumerService: KafkaConsumerService) {}

  async onApplicationBootstrap() {
    await this.kafkaConsumerService.consume(
      { topics: ['test_topic_001'] },
      { eachMessage: this.handleMessage },
    );
  }

  handleMessage = async ({
    topic,
    partition,
    message,
  }: EachMessagePayload): Promise<void> => {
    console.log('Message received: ', {
      value: message.value.toString(),
      topic: topic.toString(),
      partition: partition.toString(),
    });
  };
}
