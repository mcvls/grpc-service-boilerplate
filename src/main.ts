import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { ReflectionService } from '@grpc/reflection';
import { join } from 'path';
import { CustomLoggerService } from './common/loggers/custom-logger.service';
import { AppModule } from './app.module';
import { HEALTH_PACKAGE_NAME } from './common/health/health.inteface';
import { SAMPLE_V1_PACKAGE_NAME } from './sample/sample-service-v1.inteface';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<GrpcOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: [HEALTH_PACKAGE_NAME, SAMPLE_V1_PACKAGE_NAME],
      protoPath: [
        join(__dirname, './proto/grpc/health/v1/health.proto'),
        join(__dirname, './proto/sample/v1/sample.proto'),
      ],
      url: `0.0.0.0:${process.env.PORT}`,
      gracefulShutdown: true,
      onLoadPackageDefinition: (pkg, server) => {
        new ReflectionService(pkg).addToServer(server);
      },
    },
  });
  app.enableShutdownHooks();
  await app.listen();
  app.useLogger(app.get(CustomLoggerService));
  Logger.log(`Running on port: ${process.env.PORT}`);
}
bootstrap();
