import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { RoomTypeModule } from './room-type/room-type.module';
import { RoomViewModule } from './room-view/room-view.module';
import { RoomModule } from './room/room.module';
import { ReservationModule } from './reservation/reservation.module';

describe('AppModule', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule,
        GraphQLModule,
        PrismaModule,
        CommonModule,
        SeedModule,
        RoomTypeModule,
        RoomViewModule,
        RoomModule,
        ReservationModule,
      ],
    }).compile();
  });

  it('should compile the AppModule correctly', () => {
    expect(app).toBeDefined();
  });

  it('should have a defined GraphQL module', () => {
    const graphQLModule = app.get(GraphQLModule);
    expect(graphQLModule).toBeDefined();
  });

  it('should have a defined ConfigModule', () => {
    const configModule = app.get(ConfigModule);
    expect(configModule).toBeDefined();
  });

  it('should have a defined PrismaModule', () => {
    const prismaModule = app.get(PrismaModule);
    expect(prismaModule).toBeDefined();
  });

  it('should have a defined CommonModule', () => {
    const commonModule = app.get(CommonModule);
    expect(commonModule).toBeDefined();
  });

  it('should have a defined SeedModule', () => {
    const seedModule = app.get(SeedModule);
    expect(seedModule).toBeDefined();
  });

  it('should have a defined RoomTypeModule', () => {
    const roomTypeModule = app.get(RoomTypeModule);
    expect(roomTypeModule).toBeDefined();
  });

  it('should have a defined RoomViewModule', () => {
    const roomViewModule = app.get(RoomViewModule);
    expect(roomViewModule).toBeDefined();
  });

  it('should have a defined RoomModule', () => {
    const roomModule = app.get(RoomModule);
    expect(roomModule).toBeDefined();
  });

  it('should have a defined ReservationModule', () => {
    const reservationModule = app.get(ReservationModule);
    expect(reservationModule).toBeDefined();
  });
});
