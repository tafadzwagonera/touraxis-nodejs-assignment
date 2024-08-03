import {
  BaseEntity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb'
import { ApiProperty } from '@nestjs/swagger'

export abstract class CustomBase extends BaseEntity {
  @ApiProperty()
  @PrimaryKey()
  _id: ObjectId;

  @ApiProperty()
  @Property()
  createdAt = new Date();

  @ApiProperty()
  @Property()
  @SerializedPrimaryKey()
  id: string;

  @ApiProperty()
  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
