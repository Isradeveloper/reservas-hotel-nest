import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BillingDetails {
  @Field(() => Int)
  days: number;

  @Field(() => Int)
  nights: number;

  @Field(() => Float)
  basePrice: number;

  @Field(() => Float)
  weekendIncrease: number;

  @Field(() => Float)
  daysDiscount: number;

  @Field(() => Float)
  allInclusiveTotal: number;
}
