import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationResolver } from './reservation.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [PrismaModule, RoomModule],
  providers: [ReservationResolver, ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
