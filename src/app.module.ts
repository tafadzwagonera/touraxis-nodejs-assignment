import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import env from 'config/env.config'
import NodeEnv from 'common/enums/node-env.enum'

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: env.get('NODE_ENV') !== NodeEnv.Dev,
      isGlobal: true,
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
