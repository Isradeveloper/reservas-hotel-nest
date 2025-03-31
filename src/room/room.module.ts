import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomResolver } from './room.resolver';
import { RoomTypeModule } from '../room-type/room-type.module';
import { RoomViewModule } from '../room-view/room-view.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [RoomTypeModule, RoomViewModule, PrismaModule],
  providers: [RoomResolver, RoomService],
  exports: [RoomService],
})
export class RoomModule {}
