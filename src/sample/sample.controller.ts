import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import {
  AddNameRequest,
  AddNameResponse,
  GetHelloResponse,
  PrintNamesRequest,
  PrintNamesResponse,
  ProduceEventRequest,
  ProduceEventResponse,
  SampleServiceController,
  SampleServiceControllerMethods,
  UploadFileRequest,
  UploadFileResponse,
} from './sample-service-v1.inteface';
import GetHelloUseCase from './use-cases/get-hello.use-case';
import AddNameUseCase from './use-cases/add-name.use-case';
import PrintNamesUseCase from './use-cases/print-names.use-case';
import ProduceEventUseCase from './use-cases/produce-event.use-case';
import { RpcValidationPipe } from 'src/common/pipes/rpc-validation.pipe';
import { Metadata } from '@grpc/grpc-js';

@Controller()
@SampleServiceControllerMethods()
export class SampleController implements SampleServiceController {
  constructor(
    private getHelloUseCase: GetHelloUseCase,
    private addNameUseCase: AddNameUseCase,
    private printNamesUseCase: PrintNamesUseCase,
    private produceEventUseCase: ProduceEventUseCase,
  ) {}

  async getHello(): Promise<GetHelloResponse> {
    return await this.getHelloUseCase.execute();
  }

  @UsePipes(new RpcValidationPipe())
  async addName(request: AddNameRequest): Promise<AddNameResponse> {
    return await this.addNameUseCase.execute(request.name);
  }

  @UsePipes(new RpcValidationPipe())
  async printNames(request: PrintNamesRequest): Promise<PrintNamesResponse> {
    return await this.printNamesUseCase.execute(
      request.size,
      request.nameFilter,
    );
  }

  async produceEvent(
    request: ProduceEventRequest,
  ): Promise<ProduceEventResponse> {
    return await this.produceEventUseCase.execute(request.message);
  }

  async uploadFile(
    request: Observable<UploadFileRequest>,
  ): Promise<UploadFileResponse> {
    throw new RpcException({ code: 12, message: 'Method not implemented.' });
  }
}
