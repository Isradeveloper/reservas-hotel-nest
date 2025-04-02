import { InputType, Int, Field, ID } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsPositive,
  IsUUID,
  Matches,
} from 'class-validator';
import { isoHourMinute } from '../../../common/utils';
import { IsAfterDate } from '../../../common/decorators/is-after-date.decorator';

@InputType()
export class CreateReservationInput {
  @Field(() => String, { description: 'Check In (yyyy-MM-dd HH:mm)' })
  @IsDateString()
  @Matches(isoHourMinute, {
    message: 'Invalid check in format (yyyy-MM-dd HH:mm)',
  })
  checkIn: string;

  @IsAfterDate('checkIn', {
    message: 'Invalid check out date, must be after check in date',
  })
  @Field(() => String, { description: 'Check Out (yyyy-MM-dd HH:mm)' })
  @IsDateString()
  @Matches(isoHourMinute, {
    message: 'Invalid check out format (yyyy-MM-dd HH:mm)',
  })
  checkOut: string;

  @Field(() => Int, { description: 'People Number' })
  @IsInt()
  @IsPositive()
  peopleNumber: number;

  @Field(() => Boolean, { description: 'All Inclusive' })
  @IsBoolean()
  allInclusive: boolean;

  @Field(() => ID, { description: 'Room Type ID' })
  @IsUUID()
  roomTypeId: string;
}
