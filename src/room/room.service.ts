import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomInput, UpdateRoomInput } from './dto/inputs';
import { PrismaService } from 'src/prisma/prisma.service';
import { AvailableRoom, Room } from './entities';
import { GetAvailableRoomsArg } from './dto/args';
import { Prisma } from '@prisma/client';
import {
  calculateDiscount,
  calculatePriceAllInclusive,
  calculatePriceOfNights,
  calculateTotalWeekendDays,
  calculateTotalWeekendIncrement,
  formatDateStringCOToUTC,
  getDaysAndNights,
} from 'src/common/utils';

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoomInput: CreateRoomInput): Promise<Room> {
    const roomByNumber = await this.findOneByNumber(createRoomInput.number);

    if (roomByNumber) {
      throw new BadRequestException('Room number already exists');
    }

    return this.prismaService.room.create({
      data: createRoomInput,
    });
  }

  async findAll(): Promise<Room[]> {
    return this.prismaService.room.findMany({
      where: { isActive: true },
      orderBy: { number: 'asc' },
    });
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.prismaService.room.findUnique({
      where: { id },
    });

    if (!room) throw new BadRequestException('Room not found');
    return room;
  }

  async findOneByNumber(number: number): Promise<Room | null> {
    const room = await this.prismaService.room.findUnique({
      where: { number },
    });

    return room;
  }

  async update(updateRoomInput: UpdateRoomInput): Promise<Room> {
    const { id, ...rest } = updateRoomInput;

    await this.findOne(id);

    if (rest.number) {
      const roomByNumber = await this.findOneByNumber(rest.number);

      if (roomByNumber && roomByNumber.id !== id) {
        throw new BadRequestException('Room number already exists');
      }
    }

    return this.prismaService.room.update({
      where: { id },
      data: rest,
    });
  }

  async getAvailableRooms(
    args: GetAvailableRoomsArg,
  ): Promise<AvailableRoom[]> {
    const {
      checkIn,
      checkOut,
      peopleNumber,
      roomTypeId,
      roomViewId,
      allInclusive,
    } = args;

    const checkInDate = formatDateStringCOToUTC(checkIn);
    const checkOutDate = formatDateStringCOToUTC(checkOut);

    const whereCondition: Prisma.RoomWhereInput = {
      roomType: { isActive: true, maxCapacity: { gte: peopleNumber } },
      roomView: { isActive: true },
      isActive: true,
      roomTypeId: roomTypeId || undefined,
      roomViewId: roomViewId || undefined,
      reservations: {
        none: {
          isActive: true,
          OR: [
            { checkIn: { lt: checkOutDate }, checkOut: { gt: checkInDate } },
          ],
        },
      },
    };

    const rooms = await this.prismaService.room.findMany({
      where: whereCondition,
      orderBy: { number: 'asc' },
      select: {
        id: true,
        number: true,
        roomTypeId: true,
        roomViewId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roomType: {
          select: {
            basePrice: true,
          },
        },
      },
    });

    return rooms.map((room) => ({
      ...room,
      billingDetails: this.getBillingDetails({
        basePrice: room.roomType.basePrice,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        quantityPeople: peopleNumber,
        allInclusive: !!allInclusive,
      }),
    }));
  }

  async verifyAvailabilityOfRoom(
    args: GetAvailableRoomsArg,
    roomId: string,
  ): Promise<boolean> {
    const { checkIn, checkOut, peopleNumber, roomTypeId, roomViewId } = args;

    const checkInDate = formatDateStringCOToUTC(checkIn);
    const checkOutDate = formatDateStringCOToUTC(checkOut);

    const whereCondition: Prisma.RoomWhereUniqueInput = {
      roomType: { isActive: true, maxCapacity: { gte: peopleNumber } },
      roomView: { isActive: true },
      isActive: true,
      id: roomId,
      roomTypeId: roomTypeId || undefined,
      roomViewId: roomViewId || undefined,
      reservations: {
        none: {
          isActive: true,
          OR: [
            { checkIn: { lt: checkOutDate }, checkOut: { gt: checkInDate } },
          ],
        },
      },
    };

    const room = await this.prismaService.room.findUnique({
      where: whereCondition,
    });

    return Boolean(room);
  }

  getBillingDetails({
    basePrice,
    checkIn,
    checkOut,
    quantityPeople,
    allInclusive,
  }: {
    basePrice: number;
    checkIn: Date;
    checkOut: Date;
    quantityPeople: number;
    allInclusive: boolean;
  }) {
    const { days, nights } = getDaysAndNights(checkIn, checkOut);

    const allInclusiveTotal = allInclusive
      ? calculatePriceAllInclusive(days, nights, quantityPeople, 25000)
      : 0;
    const weekendDays = calculateTotalWeekendDays(checkIn, checkOut);
    const basePriceOfNights = calculatePriceOfNights(days, nights, basePrice);
    const discount = calculateDiscount(nights);
    const weekendIncrease = calculateTotalWeekendIncrement(
      basePrice,
      weekendDays,
      20,
    );

    const total =
      basePriceOfNights - discount + weekendIncrease + allInclusiveTotal;

    return {
      basePrice: basePriceOfNights,
      allInclusiveTotal,
      daysDiscount: discount,
      weekendDays,
      total,
      days,
      nights,
      quantityPeople,
      weekendIncrease,
    };
  }
}
