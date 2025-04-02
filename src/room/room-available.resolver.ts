import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { RoomTypeService } from '../room-type/room-type.service';
import { RoomViewService } from '../room-view/room-view.service';
import { RoomType } from '../room-type/entities/room-type.entity';
import { RoomView } from '../room-view/entities/room-view.entity';
import { AvailableRoom } from './entities';

@Resolver(() => AvailableRoom)
export class RoomAvailableResolver {
  constructor(
    private readonly roomTypeService: RoomTypeService,
    private readonly roomViewService: RoomViewService,
  ) {}

  @ResolveField(() => RoomType, { name: 'type' })
  async getTypeByRoom(@Parent() room: AvailableRoom) {
    return await this.roomTypeService.findOne(room.roomTypeId);
  }

  @ResolveField(() => RoomView, { name: 'view' })
  async getViewByRoom(@Parent() room: AvailableRoom) {
    return await this.roomViewService.findOne(room.roomViewId);
  }
}
