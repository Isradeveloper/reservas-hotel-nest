import { Module } from '@nestjs/common';
import { RoomTypeService } from './room-type.service';
import { RoomTypeResolver } from './room-type.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RoomTypeResolver, RoomTypeService],
  exports: [RoomTypeService],
})
export class RoomTypeModule {}
