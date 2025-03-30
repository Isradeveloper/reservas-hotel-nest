import { Module } from '@nestjs/common';
import { RoomTypeService } from './room-type.service';
import { RoomTypeResolver } from './room-type.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RoomTypeResolver, RoomTypeService],
})
export class RoomTypeModule {}
