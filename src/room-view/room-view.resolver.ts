import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { RoomViewService } from './room-view.service';
import { RoomView } from './entities/room-view.entity';
import { CreateRoomViewInput, UpdateRoomViewInput } from './dto/inputs';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => RoomView)
export class RoomViewResolver {
  constructor(private readonly roomViewService: RoomViewService) {}

  @Mutation(() => RoomView)
  createRoomView(
    @Args('createRoomViewInput') createRoomViewInput: CreateRoomViewInput,
  ) {
    return this.roomViewService.create(createRoomViewInput);
  }

  @Query(() => [RoomView], { name: 'roomViews' })
  async findAll(): Promise<RoomView[]> {
    return await this.roomViewService.findAll();
  }

  @Query(() => RoomView, { name: 'roomView' })
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return await this.roomViewService.findOne(id);
  }

  @Mutation(() => RoomView)
  updateRoomView(
    @Args('updateRoomViewInput') updateRoomViewInput: UpdateRoomViewInput,
  ) {
    return this.roomViewService.update(updateRoomViewInput);
  }
}
