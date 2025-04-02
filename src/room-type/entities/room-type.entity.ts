import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

@ObjectType()
export class RoomType {
  @Field(() => ID, { description: 'ID' })
  id: string;

  @Field(() => String, { description: 'Name' })
  name: string;

  @Field(() => Float, { description: 'Base Price' })
  basePrice: number;

  @Field(() => Int, { description: 'Max Capacity' })
  maxCapacity: number;

  @Field(() => Boolean, { description: 'Is Active' })
  isActive: boolean;

  @Field(() => Date, { description: 'Created At' })
  createdAt: Date;

  @Field(() => Date, { description: 'Updated At' })
  updatedAt: Date;
}
