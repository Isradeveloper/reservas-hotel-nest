import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

@InputType()
export class CreateRoomViewInput {
  @IsNotEmpty()
  @MinLength(3)
  @Field(() => String, { description: 'Name of the room view' })
  name: string;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, {
    description: 'Is the room view active',
    nullable: true,
  })
  isActive?: boolean;
}
