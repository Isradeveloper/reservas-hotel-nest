import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

@ArgsType()
export class PaginationArgs {
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @Field(() => Int, { nullable: true })
  size?: number = 10;

  @Min(0)
  @IsOptional()
  @Type(() => Number)
  @Field(() => Int, { nullable: true })
  page?: number = 1;
}
