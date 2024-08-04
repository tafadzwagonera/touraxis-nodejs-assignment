import { EntityManager } from '@mikro-orm/core'
import { TasksService } from '../tasks/tasks.service'
import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../users/users.controller'
import { UsersService } from '../users/users.service'

describe('UsersController', () => {
  let controller: UsersController

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        TasksService,
        {
          provide: EntityManager,
          useValue: EntityManager,
        },
        UsersService,
        {
          provide: EntityManager,
          useValue: EntityManager,
        },
      ],
    }).compile()

    controller = moduleRef.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
