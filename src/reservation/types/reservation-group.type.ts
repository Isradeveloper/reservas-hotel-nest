import { ReservationGroupItem } from './reservation-group-item.type';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ReservationGroup {
  @Field(() => ReservationGroupItem, { description: 'Pending reservations' })
  pending: ReservationGroupItem;

  @Field(() => ReservationGroupItem, {
    description: 'In progress reservations',
  })
  inProgress: ReservationGroupItem;
  @Field(() => ReservationGroupItem, { description: 'Past reservations' })
  past: ReservationGroupItem;
}
