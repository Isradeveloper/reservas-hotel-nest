import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Room {
  @Field(() => ID, { description: 'ID of the room' })
  id: string;

  @Field(() => Int, { description: 'Number of the room' })
  number: number;

  roomTypeId: string;

  roomViewId: string;

  @Field(() => Boolean, { description: 'Is the room active' })
  isActive: boolean;

  @Field(() => Date, { description: 'Date of creation' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date of last update' })
  updatedAt: Date;
}
