import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { EntityData } from '@mikro-orm/core'
import { User } from 'src/entities/user.entity'
import { UsersService } from './users.service'
import { Task } from '../../entities/task.entity'
import { TasksService } from '../tasks/tasks.service'

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Create user(s).' })
  @ApiResponse({
    description: 'Return created user(s).',
    status: HttpStatus.CREATED,
  })
  @Post()
  async create(@Body() body: User | User[]): Promise<User[]> {
    const users = Array.isArray(body) ? body : [body]

    return await this.usersService.create(users)
  }

  @ApiOperation({ summary: 'Create user task(s).' })
  @ApiResponse({
    description: 'Return created user task(s).',
    status: HttpStatus.CREATED,
  })
  @Post(':userId/tasks')
  async createUserTasks(
    @Param('userId') userId: string,
    @Body() body: Task | Task[],
  ): Promise<Task[]> {
    const userRef = this.usersService.getReference(userId)

    const userTasks = (Array.isArray(body) ? body : [body]).map(
      (task: Task) => {
        task.user = userRef

        return task
      },
    )

    return await this.tasksService.create(userTasks)
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ description: 'User not found.', status: HttpStatus.NOT_FOUND })
  @ApiResponse({
    description: 'Delete user.',
    status: HttpStatus.NO_CONTENT,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    if (!(await this.findOne(id)))
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)

    await this.usersService.delete(id)
  }

  @ApiOperation({ summary: 'Delete users' })
  @ApiResponse({
    description: 'Expected request query parameter: `ids` of type `string`',
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    description: 'Delete users.',
    status: HttpStatus.NO_CONTENT,
  })
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMany(@Query('ids') ids: string): Promise<void> {
    if (!ids.length)
      throw new HttpException(
        'Expected request query parameter: `ids` of type `string`',
        HttpStatus.BAD_REQUEST,
      )

    await this.usersService.deleteMany(ids.split(/,/))
  }

  @ApiOperation({ summary: 'Delete user task' })
  @ApiResponse({
    description: 'User task not found.',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    description: 'Delete user task.',
    status: HttpStatus.NO_CONTENT,
  })
  @Delete(':userId/tasks/:taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserTask(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    if (!(await this.tasksService.findOne(taskId, userId)))
      throw new HttpException('User task not found', HttpStatus.NOT_FOUND)

    await this.tasksService.delete(taskId)
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ description: 'Return all users.', status: HttpStatus.OK })
  @Get()
  async find(): Promise<User[]> {
    return await this.usersService.find()
  }

  @ApiOperation({ summary: 'Get all user tasks' })
  @ApiResponse({ description: 'Return all tasks.', status: HttpStatus.OK })
  @Get(':userId/tasks')
  async findUserTasks(@Param('userId') user: string): Promise<Task[]> {
    return await this.tasksService.find({ user })
  }

  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({ description: 'User not found.', status: HttpStatus.NOT_FOUND })
  @ApiResponse({
    description: 'Return user associated with `id`.',
    status: HttpStatus.OK,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    let foundUser: User

    if (!(foundUser = await this.usersService.findOne(id)))
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)

    return foundUser
  }

  @ApiOperation({ summary: 'Get user task' })
  @ApiResponse({
    description: 'User task not found.',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    description: 'Return task associated with `taskId` and `userId`.',
    status: HttpStatus.OK,
  })
  @Get(':userId/tasks/:taskId')
  async findOneUserTask(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
  ) {
    let foundUserTask: Task

    if (!(foundUserTask = await this.tasksService.findOne(taskId, userId)))
      throw new HttpException('User task not found', HttpStatus.NOT_FOUND)

    return foundUserTask
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ description: 'User not found.', status: HttpStatus.NOT_FOUND })
  @ApiResponse({
    description: 'Return updated user associated with `id`.',
    status: HttpStatus.OK,
  })
  @Put(':id')
  async update(
    @Body() updatedUser: EntityData<User>,
    @Param('id') id: string,
  ): Promise<User> {
    let foundUser: User

    if (!(foundUser = await this.usersService.findOne(id)))
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)

    return await this.usersService.update(foundUser, updatedUser)
  }

  @ApiOperation({ summary: 'Update user task' })
  @ApiResponse({
    description: 'User task not found.',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    description:
      'Return updated user task associated with `userId` and `taskId`.',
    status: HttpStatus.OK,
  })
  @Put(':userId/tasks/:taskId')
  async updateUserTask(
    @Body() updatedUserTask: EntityData<Task>,
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
  ): Promise<Task> {
    let foundUserTask: Task

    if (!(foundUserTask = await this.tasksService.findOne(taskId, userId)))
      throw new HttpException('User task not found', HttpStatus.NOT_FOUND)

    return await this.tasksService.update(foundUserTask, updatedUserTask)
  }
}
