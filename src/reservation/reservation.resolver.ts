import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationInput } from './dto/inputs';
import { AvailableRoom } from 'src/room/entities';
import { RoomService } from 'src/room/room.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { ReservationGroup } from './types/reservation-group.type';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly roomService: RoomService,
  ) {}

  @Mutation(() => Reservation)
  createReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationInput,
  ) {
    return this.reservationService.create(createReservationInput);
  }

  @Query(() => [Reservation], { name: 'reservations' })
  async findAll() {
    return await this.reservationService.findAll();
  }

  @Query(() => Reservation, { name: 'reservation' })
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return await this.reservationService.findOne(id);
  }

  @ResolveField(() => AvailableRoom, { name: 'room' })
  async availableRoom(@Parent() reservation: Reservation) {
    return await this.roomService.findOneRoomWithBillingDetails(
      reservation.roomId,
      reservation.checkIn,
      reservation.checkOut,
      reservation.peopleNumber,
      reservation.allInclusive,
    );
  }

  @Query(() => ReservationGroup, { name: 'reservationsGroup' })
  async reservationGroup() {
    return {
      pending: await this.reservationService.getFutureReservations(),
      inProgress: await this.reservationService.getInProgressReservations(),
      past: await this.reservationService.getPastReservations(),
    };
  }

  @Mutation(() => Reservation, { name: 'cancelReservation' })
  async cancelReservation(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ) {
    return await this.reservationService.cancelReservation(id);
  }
}
