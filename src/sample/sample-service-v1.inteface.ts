import { Metadata } from '@grpc/grpc-js';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { IsNotEmpty, Matches, Min } from 'class-validator';
import { Observable } from 'rxjs';

export const protobufPackage = 'sample.v1';

export interface GetHelloRequest {}

export interface GetHelloResponse {
  message: string;
}

export class AddNameRequest {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+$/)
  name: string;
}

export interface AddNameResponse {
  message: string;
}

export class PrintNamesRequest {
  @Min(1)
  size: number = 1;

  @Matches(/^$|[a-zA-Z]+$/)
  nameFilter: string;
}

export interface PrintNamesResponse {
  names: string[];
}

export interface ProduceEventRequest {
  message: string;
}

export interface ProduceEventResponse {
  message: string;
}

export interface UploadFileRequest {
  fileName: string;
}

export interface UploadFileResponse {
  message: string;
}

export const SAMPLE_V1_PACKAGE_NAME = 'sample.v1';

export interface SampleServiceController {
  getHello(
    request: GetHelloRequest,
    metadata?: Metadata,
  ):
    | Promise<GetHelloResponse>
    | Observable<GetHelloResponse>
    | GetHelloResponse;

  addName(
    request: AddNameRequest,
    metadata?: Metadata,
  ): Promise<AddNameResponse> | Observable<AddNameResponse> | AddNameResponse;

  printNames(
    request: PrintNamesRequest,
    metadata?: Metadata,
  ):
    | Promise<PrintNamesResponse>
    | Observable<PrintNamesResponse>
    | PrintNamesResponse;

  produceEvent(
    request: ProduceEventRequest,
    metadata?: Metadata,
  ):
    | Promise<ProduceEventResponse>
    | Observable<ProduceEventResponse>
    | ProduceEventResponse;

  uploadFile(
    request: Observable<UploadFileRequest>,
    metadata?: Metadata,
  ):
    | Promise<UploadFileResponse>
    | Observable<UploadFileResponse>
    | UploadFileResponse;
}

export function SampleServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getHello',
      'addName',
      'printNames',
      'produceEvent',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('SampleService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = ['uploadFile'];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('SampleService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}
