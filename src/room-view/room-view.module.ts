import { Module } from '@nestjs/common';
import { RoomViewService } from './room-view.service';
import { RoomViewResolver } from './room-view.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RoomViewResolver, RoomViewService],
  exports: [RoomViewService],
})
export class RoomViewModule {}
