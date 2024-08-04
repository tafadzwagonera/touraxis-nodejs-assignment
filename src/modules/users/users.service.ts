import { EntityManager, EntityData, Loaded } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { User } from 'src/entities/user.entity'

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async create(users: User[]): Promise<Loaded<User>[]> {
    const persistedUsers = users.map((user: User) =>
      this.em.create(User, user, { persist: true }),
    )

    await this.em.flush()
    return persistedUsers
  }

  async delete(id: string) {
    await this.em.remove(this.em.getReference(User, id)).flush()
  }

  getReference(id: string): User {
    return this.em.getReference(User, id)
  }

  async deleteMany(ids: string[]) {
    await Promise.all(
      ids.map((id) => this.em.remove(this.em.getReference(User, id))),
    )

    await this.em.flush()
  }

  async find(): Promise<Loaded<User>[]> {
    return await this.em.find(User, {})
  }

  async findOne(id: string): Promise<Loaded<User, 'tasks'> | null> {
    return await this.em.findOne(User, { id })
  }

  async update(
    foundUser: User,
    updatedUser: EntityData<User>,
  ): Promise<Loaded<User> | null> {
    foundUser.assign(updatedUser, {
      mergeObjectProperties: true,
    })

    await this.em.flush()
    return foundUser
  }
}
