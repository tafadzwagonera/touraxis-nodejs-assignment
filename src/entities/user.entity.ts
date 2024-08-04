import { ApiProperty } from '@nestjs/swagger'
import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'
import { CustomBase } from './custom-base.entity'
import { ObjectId } from '@mikro-orm/mongodb'
import { Task } from './task.entity'

@Entity({ tableName: 'users' })
export class User extends CustomBase {
  @ApiProperty()
  @PrimaryKey()
  _id: ObjectId

  @ApiProperty()
  @Property()
  first_name: string

  @ApiProperty()
  @Property()
  last_name?: string

  @ApiProperty()
  @Property({ unique: true })
  username: string

  @ApiProperty()
  @OneToMany({
    cascade: [Cascade.REMOVE],
    entity: () => Task,
    hidden: true,
    mappedBy: 'user',
  })
  tasks = new Collection<Task>(this)
}
