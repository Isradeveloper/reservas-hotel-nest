import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AvailableRoom } from 'src/room/entities';

@ObjectType()
export class AvailableRoomCount {
  @Field(() => Int, { description: 'Number of available rooms' })
  count: number;

  @Field(() => [AvailableRoom], { description: 'Available rooms' })
  rooms: AvailableRoom[];
}
