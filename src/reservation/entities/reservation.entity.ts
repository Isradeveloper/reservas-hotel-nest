import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Reservation {
  @Field(() => ID, { description: 'ID' })
  id: string;

  @Field(() => Date, { description: 'Check In' })
  checkIn: Date;

  @Field(() => Date, { description: 'Check Out' })
  checkOut: Date;

  @Field(() => Int, { description: 'People Number' })
  peopleNumber: number;

  @Field(() => Boolean, { description: 'All Inclusive' })
  allInclusive: boolean;

  @Field(() => Float, { description: 'Total' })
  total: number;

  @Field(() => String, { description: 'Room ID' })
  roomId: string;
}
