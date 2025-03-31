import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateRoomViewInput } from './create-room-view.input';

@InputType()
export class UpdateRoomViewInput extends PartialType(CreateRoomViewInput) {
  @Field(() => ID, { description: 'ID of the room view' })
  id: string;
}
