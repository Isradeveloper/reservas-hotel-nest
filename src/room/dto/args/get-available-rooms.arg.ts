import { ArgsType, Field, ID, Int } from '@nestjs/graphql';
import {
  IsDateString,
  IsInt,
  IsUUID,
  IsBoolean,
  Matches,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { isoHourMinute } from '../../../common/utils/regular-expressions.util';
import { IsAfterDate } from '../../../common/decorators/is-after-date.decorator';

@ArgsType()
export class GetAvailableRoomsArg {
  @Field(() => String, { description: 'Check In (yyyy-MM-dd HH:mm)' })
  @IsDateString()
  @Matches(isoHourMinute, {
    message: 'Invalid check in format (yyyy-MM-dd HH:mm)',
  })
  checkIn: string;

  @Field(() => String, { description: 'Check Out (yyyy-MM-dd HH:mm)' })
  @IsDateString()
  @Matches(isoHourMinute, {
    message: 'Invalid check out format (yyyy-MM-dd HH:mm)',
  })
  @IsAfterDate('checkIn', {
    message: 'Invalid check out date, must be after check in date',
  })
  checkOut: string;

  @Field(() => Int, { description: 'People Number' })
  @IsInt()
  @IsPositive()
  peopleNumber: number;

  @Field(() => ID, {
    description: 'Room Type ID',
    nullable: true,
    name: 'roomTypeId',
  })
  @IsUUID()
  @IsOptional()
  roomTypeId?: string;

  @Field(() => ID, {
    description: 'Room View ID',
    nullable: true,
    name: 'roomViewId',
  })
  @IsUUID()
  @IsOptional()
  roomViewId?: string;

  @Field(() => Boolean, { description: 'All Inclusive', nullable: true })
  @IsBoolean()
  @IsOptional()
  allInclusive?: boolean = false;

  @Field(() => Boolean, { description: 'Find Exterior Rooms', nullable: true })
  @IsBoolean()
  @IsOptional()
  isExterior?: boolean;
}
