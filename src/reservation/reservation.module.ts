import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationResolver } from './reservation.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { RoomModule } from '../room/room.module';
import { RoomTypeModule } from '../room-type/room-type.module';

@Module({
  imports: [PrismaModule, RoomModule, RoomTypeModule],
  providers: [ReservationResolver, ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
