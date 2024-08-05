import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from 'database/database.module'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TasksModule } from './modules/tasks/tasks.module'
import { UsersModule } from './modules/users/users.module'
import env from 'config/env.config'
import NodeEnv from 'common/enums/node-env.enum'

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile:
        env.get('NODE_ENV') === NodeEnv.Prd ||
        env.get('NODE_ENV') === NodeEnv.Stg,
      isGlobal: true,
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    TasksModule,
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
