import { ApiProperty } from '@nestjs/swagger'
import { CustomBase } from './custom-base.entity'
import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { ObjectId } from '@mikro-orm/mongodb'
import { User } from './user.entity'

@Entity({ tableName: 'tasks' })
export class Task extends CustomBase {
  @ApiProperty()
  @PrimaryKey()
  _id: ObjectId

  @ApiProperty()
  @Property()
  description?: string

  @ApiProperty()
  @Property()
  name: string

  @ApiProperty()
  @ManyToOne(() => User)
  user: User
}
