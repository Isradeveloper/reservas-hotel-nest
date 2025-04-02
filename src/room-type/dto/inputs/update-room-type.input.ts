import { IsUUID } from 'class-validator';
import { CreateRoomTypeInput } from './create-room-type.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRoomTypeInput extends PartialType(CreateRoomTypeInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
