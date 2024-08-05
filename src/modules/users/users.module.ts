import { Logger, Module } from '@nestjs/common'
import { TasksService } from '../tasks/tasks.service'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  controllers: [UsersController],
  providers: [Logger, TasksService, UsersService],
})
export class UsersModule {}
