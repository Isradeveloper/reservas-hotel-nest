import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { RoomTypeService } from './room-type.service';
import { RoomType } from './entities/room-type.entity';
import { CreateRoomTypeInput, UpdateRoomTypeInput } from './dto/inputs';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => RoomType)
export class RoomTypeResolver {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  @Mutation(() => RoomType)
  createRoomType(
    @Args('createRoomTypeInput') createRoomTypeInput: CreateRoomTypeInput,
  ) {
    return this.roomTypeService.create(createRoomTypeInput);
  }

  @Query(() => [RoomType], { name: 'roomTypes' })
  async findAll(): Promise<RoomType[]> {
    return await this.roomTypeService.findAll();
  }

  @Query(() => RoomType, { name: 'roomType' })
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return await this.roomTypeService.findOne(id);
  }

  @Mutation(() => RoomType)
  updateRoomType(
    @Args('updateRoomTypeInput') updateRoomTypeInput: UpdateRoomTypeInput,
  ) {
    return this.roomTypeService.update(updateRoomTypeInput);
  }
}
