import { HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export class AppRpcException extends RpcException {
  public readonly internalMessage: string;
  public readonly externalMessage: string;
  public readonly status: number;
  public readonly isOperational: boolean;
  public readonly sendToLog: boolean;

  constructor(
    internalMessage: any,
    externalMessage: any,
    status: number,
    isOperational: boolean,
    sendToLog: boolean = true,
  ) {
    super(internalMessage);
    this.internalMessage = internalMessage;
    this.externalMessage = externalMessage;
    this.status = status;
    this.isOperational = isOperational;
    this.sendToLog = sendToLog;
  }
}
