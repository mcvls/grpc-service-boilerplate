import { Injectable } from '@nestjs/common';
import { ProduceEventResponse } from '../sample-service-v1.inteface';
import KafkaProducerService from 'src/common/providers/kafka/kafka-producer.service';

@Injectable()
export default class ProduceEventUseCase {
  constructor(private kafkaProducerService: KafkaProducerService) {}

  async execute(message: string): Promise<ProduceEventResponse> {
    await this.kafkaProducerService.send({
      topic: 'sample',
      messages: [{ value: message }],
    });
    return { message: 'Event message sent succesfully' };
  }
}
