import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationInput, UpdateReservationInput } from './dto/inputs';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService) {}

  @Mutation(() => Reservation)
  createReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationInput,
  ) {
    return this.reservationService.create(createReservationInput);
  }

  @Query(() => [Reservation], { name: 'reservation' })
  async findAll() {
    return await this.reservationService.findAll();
  }

  @Query(() => Reservation, { name: 'reservation' })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return await this.reservationService.findOne(id);
  }

  @Mutation(() => Reservation)
  async updateReservation(
    @Args('updateReservationInput')
    updateReservationInput: UpdateReservationInput,
  ) {
    return await this.reservationService.update(updateReservationInput);
  }
}
