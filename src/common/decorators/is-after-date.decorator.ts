import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

interface DateValidationArguments extends ValidationArguments {
  object: { [key: string]: string };
}

export function IsAfterDate(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfterDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: DateValidationArguments) {
          const constraints = args.constraints as string[];
          const relatedPropertyName = constraints[0];
          const relatedValue = args.object[relatedPropertyName];
          return new Date(value) > new Date(relatedValue);
        },
      },
    });
  };
}
