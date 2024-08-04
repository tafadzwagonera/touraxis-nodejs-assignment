import 'dotenv/config'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SWAGGER_API_BEARER_AUTH_NAME } from 'common/constants'
import env from 'config/env.config'
import NodeEnv from 'common/enums/node-env.enum'
import type { LogLevel } from '@nestjs/common'

async function bootstrap() {
  const isProd =
    env.get('NODE_ENV') === NodeEnv.Prd || env.get('NODE_ENV') === NodeEnv.Stg

  const logLevel: LogLevel[] = isProd
    ? ['error', 'fatal', 'log']
    : ['debug', 'error', 'fatal', 'log', 'verbose', 'warn']

  const app = await NestFactory.create(AppModule, {
    logger: logLevel,
  })

  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT', 0)

  app.enableCors({
    origin: isProd ? configService.get<string>('CLIENT_URL') : true,
  })

  const config = new DocumentBuilder()
    .addBearerAuth(undefined, SWAGGER_API_BEARER_AUTH_NAME)
    .setDescription('TourAxis API description')
    .addTag('touraxis')
    .setTitle('TourAxis API')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  const setupOpts = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: SWAGGER_API_BEARER_AUTH_NAME,
          schema: {
            description: 'Default',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: configService.get<string>('SWAGGER_API_BEARER_TOKEN'),
        },
      },
    },
  }

  const prefix = 'api'

  SwaggerModule.setup(prefix, app, document, setupOpts)
  app.setGlobalPrefix(prefix)

  await app.listen(port)

  Logger.log(`Server listening at ${await app.getUrl()}`)
}

bootstrap()
