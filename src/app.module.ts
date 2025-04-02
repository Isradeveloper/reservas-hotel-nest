import { join } from 'path';
import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { CommonModule } from './common/common.module';
import { DateScalar } from './common/scalars/datetime.scalar';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/config.validation';
import { SeedModule } from './seed/seed.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoomTypeModule } from './room-type/room-type.module';
import { RoomViewModule } from './room-view/room-view.module';
import { RoomModule } from './room/room.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    CommonModule,
    SeedModule,
    PrismaModule,
    RoomTypeModule,
    RoomViewModule,
    RoomModule,
    ReservationModule,
  ],
  controllers: [],
  providers: [DateScalar],
})
export class AppModule {}
