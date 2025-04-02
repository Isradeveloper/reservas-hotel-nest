import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RoomService } from './room.service';
import { CreateRoomInput, UpdateRoomInput } from './dto/inputs';
import { RoomTypeService } from '../room-type/room-type.service';
import { RoomViewService } from '../room-view/room-view.service';
import { RoomType } from '../room-type/entities/room-type.entity';
import { RoomView } from '../room-view/entities/room-view.entity';
import { GetAvailableRoomsArg } from './dto/args';
import { AvailableRoom, Room } from './entities';
import { ParseUUIDPipe } from '@nestjs/common';
import { SearchArgs } from '../common/dto/args/search.args';
import { AvailableRoomCount } from './types/available-room-count.type';

@Resolver(() => Room)
export class RoomResolver {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomTypeService: RoomTypeService,
    private readonly roomViewService: RoomViewService,
  ) {}

  @Mutation(() => Room)
  async createRoom(
    @Args('createRoomInput') createRoomInput: CreateRoomInput,
  ): Promise<Room> {
    return await this.roomService.create(createRoomInput);
  }

  @Query(() => [Room], { name: 'rooms' })
  async findAll(): Promise<Room[]> {
    return await this.roomService.findAll();
  }

  @Query(() => Room, { name: 'room' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Room> {
    return await this.roomService.findOne(id);
  }

  @Mutation(() => Room)
  async updateRoom(
    @Args('updateRoomInput') updateRoomInput: UpdateRoomInput,
  ): Promise<Room> {
    return await this.roomService.update(updateRoomInput);
  }

  @ResolveField(() => RoomType, { name: 'type' })
  async getTypeByRoom(@Parent() room: Room | AvailableRoom): Promise<RoomType> {
    return await this.roomTypeService.findOne(room.roomTypeId);
  }

  @ResolveField(() => RoomView, { name: 'view' })
  async getViewByRoom(@Parent() room: Room | AvailableRoom): Promise<RoomView> {
    return await this.roomViewService.findOne(room.roomViewId);
  }

  @Query(() => AvailableRoomCount, { name: 'availableRooms' })
  async getAvailableRooms(
    @Args() args: GetAvailableRoomsArg,
    @Args() searchArgs: SearchArgs,
  ): Promise<AvailableRoomCount> {
    return await this.roomService.getAvailableRooms(args, searchArgs);
  }
}
