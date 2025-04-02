import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReservationInput } from './dto/inputs';
import { PrismaService } from '../prisma/prisma.service';
import { Reservation } from './entities/reservation.entity';
import { formatDateStringCOToUTC, randomNumber } from '../common/utils';
import { RoomService } from '../room/room.service';
import { RoomTypeService } from '../room-type/room-type.service';
import { AvailableRoom } from '../room/entities/available-room.entity';
import { ReservationGroupItem } from './types/reservation-group-item.type';

@Injectable()
export class ReservationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly roomService: RoomService,
    private readonly roomTypeService: RoomTypeService,
  ) {}

  async create(
    createReservationInput: CreateReservationInput,
  ): Promise<Reservation> {
    const { checkIn, checkOut, peopleNumber, roomTypeId, allInclusive } =
      createReservationInput;

    const rooms = await this.getAvailableRooms(
      checkIn,
      checkOut,
      peopleNumber,
      roomTypeId,
    );

    const randomRoom = rooms[randomNumber(0, rooms.length - 1)];
    const roomType = await this.roomTypeService.findOne(randomRoom.roomTypeId);

    const formattedCheckIn = formatDateStringCOToUTC(checkIn);
    const formattedCheckOut = formatDateStringCOToUTC(checkOut);

    const billingDetails = this.roomService.getBillingDetails({
      basePrice: roomType.basePrice,
      checkIn: formattedCheckIn,
      checkOut: formattedCheckOut,
      quantityPeople: peopleNumber,
      allInclusive,
    });

    return this.prismaService.reservation.create({
      data: {
        roomId: randomRoom.id,
        peopleNumber,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        total: billingDetails.total,
        allInclusive,
      },
    });
  }

  async findAll(): Promise<Reservation[]> {
    return this.prismaService.reservation.findMany({
      where: { isActive: true },
      orderBy: { checkIn: 'asc' },
    });
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.prismaService.reservation.findUnique({
      where: { id, isActive: true },
    });

    if (!reservation) throw new BadRequestException('Reservation not found');

    return reservation;
  }

  async getAvailableRooms(
    checkIn: string,
    checkOut: string,
    peopleNumber: number,
    roomTypeId: string,
  ): Promise<AvailableRoom[]> {
    const { count, rooms } = await this.roomService.getAvailableRooms(
      {
        checkIn,
        checkOut,
        peopleNumber,
        roomTypeId,
      },
      {},
    );

    if (count === 0) throw new BadRequestException('No available rooms');

    return rooms;
  }

  async getPastReservations(): Promise<ReservationGroupItem> {
    const reservations = await this.prismaService.reservation.findMany({
      where: { isActive: true, checkOut: { lt: new Date() } },
      orderBy: { checkIn: 'asc' },
    });
    return {
      count: reservations.length,
      reservations,
    };
  }

  async getInProgressReservations(): Promise<ReservationGroupItem> {
    const reservations = await this.prismaService.reservation.findMany({
      where: {
        isActive: true,
        checkIn: { lte: new Date() },
        checkOut: { gt: new Date() },
      },
      orderBy: { checkIn: 'asc' },
    });
    return {
      count: reservations.length,
      reservations,
    };
  }

  async getFutureReservations(): Promise<ReservationGroupItem> {
    const reservations = await this.prismaService.reservation.findMany({
      where: { isActive: true, checkIn: { gt: new Date() } },
      orderBy: { checkIn: 'asc' },
    });
    return {
      count: reservations.length,
      reservations,
    };
  }

  async cancelReservation(id: string): Promise<Reservation> {
    await this.findOne(id);

    const reservation = await this.prismaService.reservation.update({
      where: { id },
      data: { isActive: false },
    });
    return reservation;
  }
}
