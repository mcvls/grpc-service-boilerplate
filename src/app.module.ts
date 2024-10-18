import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import * as joi from 'joi';
import { CorrelationInterceptor } from './common/interceptors/correlation.interceptor';
import { LoggerModule } from './common/loggers/logger.module';
import { CacheModule } from './common/providers/cache/cache.module';
import { EncryptionHelper } from './common/helpers/encryption.helper';
import { HelperModule } from './common/helpers/helper.module';
import { AppExceptionFilter } from './common/filters/app-exception.filter';
import { ContextModule } from './common/context/context.module';
import { HealthModule } from './common/health/health.module';
import { ServiceModule } from './service/service.module';
import { SampleModule } from './sample/sample.module';

const configValidationSchema = joi.object({
  NODE_ENV: joi
    .string()
    .valid('development', 'test', 'sandbox', 'live')
    .required(),
  PORT: joi.number().required().default(50050),
  LOG_DIR: joi.string().required(),
  LOG_FILENAME: joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    HelperModule,
    CacheModule.forRootAsync({
      imports: [ConfigModule, HelperModule],
      inject: [ConfigService, EncryptionHelper],
      useFactory: async (
        configService: ConfigService,
        encrpytionHelper: EncryptionHelper,
      ) => ({
        environment: configService.get('NODE_ENV'),
        port: configService.get('REDIS_PORT'),
        host: configService.get('REDIS_HOST'),
        username: encrpytionHelper.decrypt(configService.get('REDIS_USER')),
        password: encrpytionHelper.decrypt(configService.get('REDIS_PASSWORD')),
        db: configService.get('REDIS_DB'),
      }),
    }),
    /* 
    QueueModule.forRootAsync({
      imports: [ConfigModule, HelperModule],
      inject: [ConfigService, EncryptionHelper],
      useFactory: async (
        configService: ConfigService,
        encrpytionHelper: EncryptionHelper,
      ) => ({
        protocol: configService.get('RABBITMQ_PROTOCOL'),
        hostname: configService.get('RABBITMQ_HOST'),
        username: encrpytionHelper.decrypt(configService.get('RABBITMQ_USER')),
        password: encrpytionHelper.decrypt(
          configService.get('RABBITMQ_PASSWORD'),
        ),
      }),
    }),
    DatabaseModule.forRootAsync({
      imports: [ConfigModule, HelperModule],
      inject: [ConfigService, EncryptionHelper],
      useFactory: async (
        configService: ConfigService,
        encrpytionHelper: EncryptionHelper,
      ) => ({
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        database: configService.get('DB_NAME'),
        username: encrpytionHelper.decrypt(configService.get('DB_USER')),
        password: encrpytionHelper.decrypt(configService.get('DB_PASSWORD')),
        connectionLimit: configService.get('DB_CONNECTION_LIMIT'),
      }),
    }), 
    AWSModule.forRootAsync({
      imports: [ConfigModule, HelperModule],
      inject: [ConfigService, EncryptionHelper],
      useFactory: async (
        configService: ConfigService,
        encrpytionHelper: EncryptionHelper,
      ) => ({
        region: configService.get('AWS_REGION'),
        accessKeyId:  encrpytionHelper.decrypt(configService.get('AWS_ACCESS_KEY_ID')),
        secretAccessKey:  encrpytionHelper.decrypt(configService.get('AWS_SECRET_ACCESS_KEY')),
      }),
    }),
    */
    ContextModule,
    LoggerModule,
    HealthModule,
    ServiceModule,
    SampleModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CorrelationInterceptor,
    },
  ],
})
export class AppModule implements OnApplicationShutdown {
  onApplicationShutdown(signal: string): void {
    Logger.log(`Termination signal ${signal} received, app will shutdown`);
  }
}
