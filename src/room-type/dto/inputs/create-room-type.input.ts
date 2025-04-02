import { InputType, Int, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsInt,
  MinLength,
  Min,
  IsBoolean,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateRoomTypeInput {
  @IsNotEmpty()
  @MinLength(3)
  @Field(() => String, { description: 'Name' })
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Field(() => Float, { description: 'Base Price' })
  basePrice: number;

  @IsInt()
  @Min(1)
  @Field(() => Int, { description: 'Max Capacity' })
  maxCapacity: number;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { description: 'Is Active', nullable: true })
  isActive?: boolean;
}
