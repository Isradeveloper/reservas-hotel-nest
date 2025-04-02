import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsInt, IsUUID, IsPositive } from 'class-validator';

@InputType()
export class CreateRoomInput {
  @IsInt()
  @IsPositive()
  @Field(() => Int, { description: 'Number of the room' })
  number: number;

  @IsUUID()
  @Field(() => ID, { description: 'Type of the room' })
  roomTypeId: string;

  @IsUUID()
  @Field(() => ID, { description: 'View of the room' })
  roomViewId: string;
}
