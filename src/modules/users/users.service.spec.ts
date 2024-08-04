import { EntityManager } from '@mikro-orm/core'
import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from '../users/users.service'

describe('UsersService', () => {
  let service: UsersService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: EntityManager,
          useValue: EntityManager,
        },
      ],
    }).compile()

    service = moduleRef.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
