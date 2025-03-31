import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReservationInput, UpdateReservationInput } from './dto/inputs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Reservation } from './entities/reservation.entity';
import { formatDateStringCOToUTC } from 'src/common/utils';
import { RoomService } from 'src/room/room.service';

@Injectable()
export class ReservationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly roomService: RoomService,
  ) {}

  async create(
    createReservationInput: CreateReservationInput,
  ): Promise<Reservation> {
    //* VALIDAR DISPONIBILIDAD

    const { checkIn, checkOut, peopleNumber, ...rest } = createReservationInput;

    const { id, roomTypeId, roomViewId, number } =
      await this.roomService.findOne(createReservationInput.roomId);

    const isAvailable = await this.roomService.verifyAvailabilityOfRoom(
      {
        checkIn,
        checkOut,
        peopleNumber,
        roomTypeId,
        roomViewId,
      },
      id,
    );

    if (!isAvailable) {
      throw new BadRequestException(`Room ${number} is not available`);
    }

    const formattedCheckIn = formatDateStringCOToUTC(checkIn);
    const formattedCheckOut = formatDateStringCOToUTC(checkOut);

    return this.prismaService.reservation.create({
      data: {
        ...rest,
        peopleNumber,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        total: 100,
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
      where: { id },
    });

    if (!reservation) throw new BadRequestException('Reservation not found');
    return reservation;
  }

  async update(
    updateReservationInput: UpdateReservationInput,
  ): Promise<Reservation> {
    const { id, ...rest } = updateReservationInput;

    await this.findOne(id);

    //* VALIDAR DISPONIBILIDAD SI CAMBIAN FECHAS

    //* VALIDAR DISPONIBILIDAD SI CAMBIAN HABITACION

    //* RECALCULAR TOTAL

    return this.prismaService.reservation.update({
      where: { id },
      data: rest,
    });
  }
}
