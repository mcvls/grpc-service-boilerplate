import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { ReflectionService } from '@grpc/reflection';
import { join } from 'path';
import { CustomLoggerService } from './common/loggers/custom-logger.service';
import { SAMPLESERVICE_PACKAGE_NAME } from './sample/sample-service.inteface';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<GrpcOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: SAMPLESERVICE_PACKAGE_NAME,
      protoPath: join(__dirname, './sample/proto/sample_service.proto'),
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
