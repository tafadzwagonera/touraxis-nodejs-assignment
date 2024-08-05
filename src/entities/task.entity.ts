import { ApiProperty } from '@nestjs/swagger'
import { CustomBase } from './custom-base.entity'
import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { ObjectId } from '@mikro-orm/mongodb'
import { User } from './user.entity'

export enum Status {
  Complete = 'complete',
  InProgress = 'in-progress',
  Pending = 'pending',
}

@Entity({ tableName: 'tasks' })
export class Task extends CustomBase {
  @ApiProperty()
  @PrimaryKey()
  _id: ObjectId

  @ApiProperty()
  @Property()
  date_time?: Date

  @ApiProperty()
  @Property()
  description?: string

  @ApiProperty()
  @Property()
  name: string

  @ApiProperty()
  @Property()
  next_execute_date_time?: Date

  @ApiProperty()
  @Property()
  @Enum()
  status?: Status

  @ApiProperty()
  @ManyToOne(() => User)
  user: User
}
