import { ConsoleLogger, Inject, LogLevel } from '@nestjs/common';
import { Context } from '../context/context';

export class CustomLoggerService extends ConsoleLogger {
  @Inject()
  private reqContext: Context;

  protected colorize(message: string, logLevel: LogLevel) {
    return message;
  }

  protected formatContext(context: string): string {
    return context;
  }

  protected getTimestamp(): string {
    return new Date().toISOString();
  }

  protected printStackTrace(stack: string) {
    return;
  }

  protected formatMessage(
    logLevel: LogLevel,
    message: unknown,
    pidMessage: string,
    formattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string,
  ): string {
    const correlationId = this.reqContext.get<any>()?.correlation_id;
    return `${JSON.stringify({
      level: logLevel,
      timestamp: this.getTimestamp(),
      correlationId,
      message,
      metadata: contextMessage,
    })}\n`;
  }
}
