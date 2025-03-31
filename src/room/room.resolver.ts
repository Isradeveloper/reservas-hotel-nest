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
import { RoomType } from 'src/room-type/entities/room-type.entity';
import { RoomView } from 'src/room-view/entities/room-view.entity';
import { GetAvailableRoomsArg } from './dto/args';
import { AvailableRoom, Room } from './entities';

@Resolver(() => Room)
export class RoomResolver {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomTypeService: RoomTypeService,
    private readonly roomViewService: RoomViewService,
  ) {}

  @Mutation(() => Room)
  async createRoom(@Args('createRoomInput') createRoomInput: CreateRoomInput) {
    return await this.roomService.create(createRoomInput);
  }

  @Query(() => [Room], { name: 'rooms' })
  async findAll() {
    return await this.roomService.findAll();
  }

  @Query(() => Room, { name: 'room' })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return await this.roomService.findOne(id);
  }

  @Mutation(() => Room)
  async updateRoom(@Args('updateRoomInput') updateRoomInput: UpdateRoomInput) {
    return await this.roomService.update(updateRoomInput);
  }

  @ResolveField(() => RoomType, { name: 'type' })
  async getTypeByRoom(@Parent() room: Room | AvailableRoom) {
    return await this.roomTypeService.findOne(room.roomTypeId);
  }

  @ResolveField(() => RoomView, { name: 'view' })
  async getViewByRoom(@Parent() room: Room | AvailableRoom) {
    return await this.roomViewService.findOne(room.roomViewId);
  }

  @Query(() => [AvailableRoom], { name: 'availableRooms' })
  async getAvailableRooms(@Args() args: GetAvailableRoomsArg) {
    return await this.roomService.getAvailableRooms(args);
  }
}
