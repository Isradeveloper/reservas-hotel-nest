import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  @Mutation(() => String, {
    name: 'executeSeed',
    description: 'Llena la base de datos (Solo para desarrollo)',
  })
  async executeSeed() {
    return await this.seedService.executeSeed();
  }
}
