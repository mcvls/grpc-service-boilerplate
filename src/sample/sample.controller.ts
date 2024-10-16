import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import {
  AddNameRequest,
  AddNameResponse,
  GetHelloResponse,
  PrintNamesRequest,
  PrintNamesResponse,
  SampleServiceController,
  SampleServiceControllerMethods,
  UploadFileRequest,
  UploadFileResponse,
} from './sample-service.inteface';
import GetHelloUseCase from './use-cases/get-hello.use-case';
import AddNameUseCase from './use-cases/add-name.use-case';
import PrintNamesUseCase from './use-cases/print-names.use-case';
import { RpcValidationPipe } from 'src/common/pipes/rpc-validation.pipe';

@Controller()
@SampleServiceControllerMethods()
export class SampleController implements SampleServiceController {
  constructor(
    private getHelloUseCase: GetHelloUseCase,
    private addNameUseCase: AddNameUseCase,
    private printNamesUseCase: PrintNamesUseCase,
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

  async uploadFile(
    request: Observable<UploadFileRequest>,
  ): Promise<UploadFileResponse> {
    throw new RpcException({ code: 12, message: 'Method not implemented.' });
  }
}
