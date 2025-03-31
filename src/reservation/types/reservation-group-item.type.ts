import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Reservation } from '../entities/reservation.entity';

@ObjectType()
export class ReservationGroupItem {
  @Field(() => Int, { description: 'Number of reservations' })
  count: number;

  @Field(() => [Reservation], { description: 'Reservations' })
  reservations: Reservation[];
}
