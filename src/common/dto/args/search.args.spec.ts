import 'reflect-metadata';

import { validate } from 'class-validator';
import { SearchArgs } from './search.args';

describe('SearchArgsDto', () => {
  it('should validate with default values', async () => {
    const dto = new SearchArgs();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should validate with valid data', async () => {
    const dto = new SearchArgs();
    dto.search = 'test';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
