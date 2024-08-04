import { EntityCaseNamingStrategy, EntityManager, MongoDriver } from '@mikro-orm/mongodb'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Task } from '../../entities/task.entity'
import { TasksService } from './tasks.service'
import { Test, TestingModule } from '@nestjs/testing'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { User } from '../../entities/user.entity'
import { UsersService } from '../users/users.service'
import * as dotenv from 'dotenv'

describe('TasksService', () => {
  let em: EntityManager
  let tasksService: TasksService
  let usersService: UsersService

  beforeAll(async () => {
    dotenv.config({ path: '.env.test' })

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          allowGlobalContext: true,
          clientUrl: process.env.MONGODB_URI as string,
          driver: MongoDriver,
          entities: ['./dist/src/entities'],
          entitiesTs: ['./src/entities'],
          metadataProvider: TsMorphMetadataProvider,
          namingStrategy: EntityCaseNamingStrategy,
        }),
      ],
      providers: [TasksService, UsersService],
    }).compile()

    em = moduleRef.get(EntityManager)
    tasksService = moduleRef.get<TasksService>(TasksService)
    usersService = moduleRef.get<UsersService>(UsersService)
  })

  describe('TaskService', () => {
    it('should create a new `Task`', async () => {
      const task = new Task()
      const user = new User()

      user.first_name = 'John'
      user.username = 'jsmith'

      task.name = 'Bar'
      task.description = 'This is a test description'
      task.user = user

      const persistedTasks = await tasksService.create([task])

      expect(persistedTasks).not.toBeNull()
      expect(persistedTasks.length).toBe(1)
      expect(persistedTasks[0].name).toBe(task.name)
      expect(persistedTasks[0].description).toBe(task.description)
      await tasksService.delete(persistedTasks[0].id)
      await usersService.delete(persistedTasks[0].user.id)
      em.clear()
    }, 0)
  })

  it('should find the created `Task`', async () => {
    const task = new Task()
    const user = new User()

    user.first_name = 'John'
    user.username = 'jsmith'

    task.name = 'Baz'
    task.description = 'This is a test description'
    task.user = user

    await tasksService.create([task])

    const foundTasks = await tasksService.find({ name: task.name })

    expect(foundTasks.length).toBe(1)
    expect(foundTasks[0].name).toBe(task.name)
    expect(foundTasks[0].description).toBe(task.description)
    await usersService.delete(foundTasks[0].id)
    await usersService.delete(foundTasks[0].user.id)
    em.clear()
  })
})
