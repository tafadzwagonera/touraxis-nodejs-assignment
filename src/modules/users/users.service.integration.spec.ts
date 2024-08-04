import { EntityCaseNamingStrategy, MongoDriver } from '@mikro-orm/mongodb'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Test, TestingModule } from '@nestjs/testing'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { User } from '../../entities/user.entity'
import { UsersService } from '../users/users.service'
import * as dotenv from 'dotenv'

describe('UserService', () => {
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
      providers: [UsersService],
    }).compile()

    usersService = moduleRef.get<UsersService>(UsersService)
  })

  describe('UserService', () => {
    it('should create a new `User`', async () => {
      const user = new User()

      user.first_name = 'John'
      user.username = 'jsmith'

      const persistedUsers = await usersService.create([user])

      expect(persistedUsers).not.toBeNull()
      expect(persistedUsers.length).toBe(1)
      expect(persistedUsers[0].first_name).toBe(user.first_name)
      expect(persistedUsers[0].username).toBe(user.username)
      expect(persistedUsers[0].tasks.length).toBe(0)
      await usersService.delete(persistedUsers[0]._id?.toHexString())
    }, 0)
  })

  it('should find the created `User`', async () => {
    const user = new User()

    user.first_name = 'John'
    user.username = 'jsmith'

    const persistedUsers = await usersService.create([user])
    const foundUser = await usersService.findOne(
      persistedUsers[0]._id?.toHexString(),
    )

    expect(foundUser).not.toBeNull()
    expect(foundUser.first_name).toBe(user.first_name)
    expect(foundUser.username).toBe(user.username)
    expect(foundUser.tasks.length).toBe(0)
    await usersService.delete(foundUser._id?.toHexString())
  }, 0)
})
