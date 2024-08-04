import { EntityManager } from '@mikro-orm/core'
import { TasksController } from '../tasks/tasks.controller'
import { TasksService } from '../tasks/tasks.service'
import { Test, TestingModule } from '@nestjs/testing'

describe('TasksController', () => {
  let controller: TasksController

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: EntityManager,
          useValue: EntityManager,
        },
      ],
    }).compile()

    controller = moduleRef.get<TasksController>(TasksController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
