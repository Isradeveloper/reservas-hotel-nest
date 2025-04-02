import { Test, TestingModule } from '@nestjs/testing';
import { SeedResolver } from './seed.resolver';
import { SeedService } from './seed.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

describe('SeedResolver', () => {
  let resolver: SeedResolver;
  let service: SeedService;

  const mockResult = 'Seed executed successfully';
  const mockError = new Error('Initial seed error');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
      providers: [SeedResolver, SeedService, PrismaService, ConfigService],
    }).compile();

    resolver = module.get<SeedResolver>(SeedResolver);
    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('executeSeed Mutation', () => {
    it('should execute seed successfully', async () => {
      const spy = jest
        .spyOn(service, 'executeSeed')
        .mockResolvedValueOnce(mockResult);

      const result = await resolver.executeSeed();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockResult);
    });

    it('should handle service errors', async () => {
      const spy = jest
        .spyOn(service, 'executeSeed')
        .mockRejectedValueOnce(mockError);

      await expect(resolver.executeSeed()).rejects.toThrow(mockError);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
