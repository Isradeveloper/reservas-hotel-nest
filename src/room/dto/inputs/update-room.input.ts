import { CreateRoomInput } from './create-room.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRoomInput extends PartialType(CreateRoomInput) {
  @Field(() => ID)
  id: string;
}
