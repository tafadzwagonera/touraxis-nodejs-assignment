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
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { Task } from 'src/entities/task.entity'
import { TasksService } from './tasks.service'

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create task(s).' })
  @ApiResponse({
    description: 'Return created task(s).',
    status: HttpStatus.CREATED,
  })
  @Post()
  async create(@Body() body: Task | Task[]): Promise<Task[]> {
    const tasks = Array.isArray(body) ? body : [body]

    return await this.tasksService.create(tasks)
  }

  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ description: 'Task not found.', status: HttpStatus.NOT_FOUND })
  @ApiResponse({
    description: 'Delete task.',
    status: HttpStatus.NO_CONTENT,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    if (!(await this.tasksService.findOne(id)))
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND)

    await this.tasksService.delete(id)
  }

  @ApiOperation({ summary: 'Delete tasks' })
  @ApiResponse({
    description: 'Expected request query parameter: `ids` of type `string`',
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    description: 'Delete tasks.',
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

    await this.tasksService.deleteMany(ids.split(/,/))
  }
}
