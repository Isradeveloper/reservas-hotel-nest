import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  DOUBLE_ROOMS,
  PRESIDENCIAL_ROOMS,
  ROOM_TYPES,
  ROOM_VIEWS,
  SINGLE_ROOMS,
} from './data/seed.data';
import { RoomType } from '../room-type/entities/room-type.entity';
import { RoomView } from '../room-view/entities/room-view.entity';
import { Room } from '../room/entities';
import { randomNumber } from '../common/utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async executeSeed() {
    if (this.configService.get('ENV') !== 'dev')
      throw new Error('Seed can only be executed in development environment');

    await this.deleteData();
    const roomTypes = await this.createRoomTypes();
    const roomViews = await this.createRoomViews();

    const singleRoomType = roomTypes.find(
      (roomType) => roomType.name === 'SENCILLA',
    );
    const doubleRoomType = roomTypes.find(
      (roomType) => roomType.name === 'DOBLE',
    );
    const presidencialRoomType = roomTypes.find(
      (roomType) => roomType.name === 'PRESIDENCIAL',
    );

    if (!singleRoomType || !doubleRoomType || !presidencialRoomType)
      throw new Error('Room types not found');

    await this.createRoomsByType(singleRoomType, SINGLE_ROOMS(10), roomViews);
    await this.createRoomsByType(doubleRoomType, DOUBLE_ROOMS(15), roomViews);
    await this.createRoomsByType(
      presidencialRoomType,
      PRESIDENCIAL_ROOMS(5),
      roomViews,
    );

    return 'Seed executed successfully';
  }

  async deleteData(): Promise<void> {
    await this.prismaService.reservation.deleteMany({});
    await this.prismaService.room.deleteMany({});
    await this.prismaService.roomType.deleteMany({});
    await this.prismaService.roomView.deleteMany({});
  }

  async createRoomTypes(): Promise<RoomType[]> {
    return await this.prismaService.roomType.createManyAndReturn({
      data: ROOM_TYPES,
      skipDuplicates: true,
    });
  }

  async createRoomViews(): Promise<RoomView[]> {
    return await this.prismaService.roomView.createManyAndReturn({
      data: ROOM_VIEWS,
      skipDuplicates: true,
    });
  }

  async createRoomsByType(
    roomType: RoomType,
    numbers: number[],
    views: RoomView[],
  ): Promise<Room[]> {
    return await this.prismaService.room.createManyAndReturn({
      data: numbers.map((number) => ({
        roomViewId: views[randomNumber(0, views.length - 1)].id,
        roomTypeId: roomType.id,
        number,
      })),
      skipDuplicates: true,
    });
  }
}
