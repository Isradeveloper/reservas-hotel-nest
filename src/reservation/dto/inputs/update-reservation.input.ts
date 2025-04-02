import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateReservationInput } from './create-reservation.input';

@InputType()
export class UpdateReservationInput extends PartialType(
  CreateReservationInput,
) {
  @Field(() => ID, { description: 'ID' })
  id: string;
}
