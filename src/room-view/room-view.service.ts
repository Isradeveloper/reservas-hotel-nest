import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomViewInput, UpdateRoomViewInput } from './dto/inputs';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomView } from './entities/room-view.entity';

@Injectable()
export class RoomViewService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoomViewInput: CreateRoomViewInput): Promise<RoomView> {
    const roomViewByName = await this.findOneByName(createRoomViewInput.name);

    if (roomViewByName) {
      throw new BadRequestException('RoomView name already exists');
    }

    return this.prismaService.roomView.create({
      data: createRoomViewInput,
    });
  }

  async findAll(): Promise<RoomView[]> {
    return this.prismaService.roomView.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<RoomView> {
    const roomView = await this.prismaService.roomView.findUnique({
      where: { id },
    });

    if (!roomView) throw new BadRequestException('RoomView not found');
    return roomView;
  }

  async findOneByName(name: string): Promise<RoomView | null> {
    const roomView = await this.prismaService.roomView.findUnique({
      where: { name },
    });

    return roomView;
  }

  async update(updateRoomViewInput: UpdateRoomViewInput): Promise<RoomView> {
    const { id, ...rest } = updateRoomViewInput;

    await this.findOne(id);

    if (rest.name) {
      const roomViewByName = await this.findOneByName(rest.name);

      if (roomViewByName && roomViewByName.id !== id) {
        throw new BadRequestException('RoomView name already exists');
      }
    }

    return this.prismaService.roomView.update({
      where: { id },
      data: rest,
    });
  }
}
