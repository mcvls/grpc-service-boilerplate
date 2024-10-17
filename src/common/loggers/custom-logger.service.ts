import { Injectable, LoggerService } from '@nestjs/common';
import { transports, format, createLogger, Logger } from 'winston';
import 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';
import { Context } from '../context/context';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: Logger;
  private context: Context;
  constructor(configService: ConfigService, context: Context) {
    const logDir = configService.get('LOG_DIR');
    const logFileName = configService.get('LOG_FILENAME');
    const serverId = configService.get('SERVER_ID') ?? 'localhost';
    this.context = context;
    this.logger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.DailyRotateFile({
          level: 'info',
          filename: `${logDir}/${logFileName}${
            serverId ? '-(' + serverId + ')' : ''
          }-%DATE%.info`,
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
          }-%DATE%.error`,
          extension: '.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
        // we also want to see logs in our console
        //new transports.Console(),
      ],
    });
  }

  private getCorrelationId(): any {
    const correlationId = this.context.get<any>()?.correlation_id;
    return correlationId;
  }

  log(message: any, ...optionalParams: any[]) {
    const correlationId = this.getCorrelationId();
    if (correlationId)
      this.logger.info(message, { correlationId: this.getCorrelationId() });
    else this.logger.info(message);
  }
  error(message: any, ...optionalParams: any[]) {
    const correlationId = this.getCorrelationId();
    if (correlationId)
      this.logger.error(message, {
        correlationId: this.getCorrelationId(),
        stack: message.stack,
      });
    else this.logger.error(message);
  }
  warn(message: any, ...optionalParams: any[]) {
    const reqId = this.getCorrelationId();
    if (reqId)
      this.logger.log(message, { correlationId: this.getCorrelationId() });
    else this.logger.log(message);
  }
  debug?(message: any, ...optionalParams: any[]) {
    const reqId = this.getCorrelationId();
    if (reqId)
      this.logger.debug(message, { correlationId: this.getCorrelationId() });
    else this.logger.debug(message);
  }
}
