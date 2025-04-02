import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomTypeInput, UpdateRoomTypeInput } from './dto/inputs';
import { PrismaService } from '../prisma/prisma.service';
import { RoomType } from './entities/room-type.entity';

@Injectable()
export class RoomTypeService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoomTypeInput: CreateRoomTypeInput): Promise<RoomType> {
    const roomTypeByName = await this.findOneByName(createRoomTypeInput.name);

    if (roomTypeByName) {
      throw new BadRequestException('RoomType name already exists');
    }

    return this.prismaService.roomType.create({
      data: createRoomTypeInput,
    });
  }

  async findAll(): Promise<RoomType[]> {
    return this.prismaService.roomType.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<RoomType> {
    const roomType = await this.prismaService.roomType.findUnique({
      where: { id },
    });

    if (!roomType) throw new BadRequestException('RoomType not found');
    return roomType;
  }

  async findOneByName(name: string): Promise<RoomType | null> {
    const roomType = await this.prismaService.roomType.findUnique({
      where: { name },
    });

    return roomType;
  }

  async update(updateRoomTypeInput: UpdateRoomTypeInput): Promise<RoomType> {
    const { id, ...rest } = updateRoomTypeInput;

    await this.findOne(id);

    if (rest.name) {
      const roomTypeByName = await this.findOneByName(rest.name);

      if (roomTypeByName && roomTypeByName.id !== id) {
        throw new BadRequestException('RoomType name already exists');
      }
    }

    return this.prismaService.roomType.update({
      where: { id },
      data: rest,
    });
  }
}
