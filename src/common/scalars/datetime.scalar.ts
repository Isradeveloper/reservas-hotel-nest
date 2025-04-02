import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { formatInTimeZone } from 'date-fns-tz';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  description = 'DateTime custom scalar type';

  parseValue(value: string): Date {
    return new Date(value);
  }

  serialize(value: Date): string {
    return formatInTimeZone(value, 'America/Bogota', 'yyyy-MM-dd HH:mm:ss');
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error('Invalid date format');
  }
}
