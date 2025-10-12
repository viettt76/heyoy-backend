import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    app.enableCors({
        origin: configService.get('app.frontendUrl'),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    });

    app.setGlobalPrefix('api');

    app.use(cookieParser());

    await app.listen(configService.get('app.port') ?? 8080);

    Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
