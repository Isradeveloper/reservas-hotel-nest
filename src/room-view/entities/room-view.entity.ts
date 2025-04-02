import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class RoomView {
  @Field(() => ID, { description: 'ID of the room view' })
  id: string;

  @Field(() => String, { description: 'Name of the room view' })
  name: string;

  @Field(() => Date, { description: 'Creation date of the room view' })
  createdAt: Date;

  @Field(() => Date, { description: 'Last update date of the room view' })
  updatedAt: Date;

  @Field(() => Boolean, { description: 'Is the room view active' })
  isActive: boolean;
}
