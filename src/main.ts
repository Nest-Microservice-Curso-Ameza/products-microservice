import { env } from 'process';
import { envs } from './config';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ExceptionFilter } from './common/exceptions/rpc-exception.filter';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
     AppModule,
     {
       transport: Transport.TCP,
       options: {
           port: envs.port
       }
     }
    );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }),
  );

  app.useGlobalFilters(
    new ExceptionFilter()
  )

  // await app.listen( envs.port );
  await app.listen();
  // console.log(`App running in port ${env.port}`)
  console.log(`Products microservice running in port ${env.port}`)
}
bootstrap();
