import 'dotenv/config'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import env from 'config/env.config'
import NodeEnv from 'common/enums/node-env.enum'
import type { LogLevel } from '@nestjs/common'

async function bootstrap() {
  const isProd = env.get('NODE_ENV') === NodeEnv.Prd

  const logLevel: LogLevel[] = isProd
    ? ['error', 'fatal', 'log']
    : ['debug', 'error', 'fatal', 'log', 'verbose', 'warn']

  const app = await NestFactory.create(AppModule, {
    logger: logLevel,
  })

  await app.listen(3000)

  Logger.log(`Server listening at ${await app.getUrl()}`)
}

bootstrap()
