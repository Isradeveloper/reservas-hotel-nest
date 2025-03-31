import { Test, TestingModule } from '@nestjs/testing';
import { RoomViewResolver } from './room-view.resolver';
import { RoomViewService } from './room-view.service';

describe('RoomViewResolver', () => {
  let resolver: RoomViewResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomViewResolver, RoomViewService],
    }).compile();

    resolver = module.get<RoomViewResolver>(RoomViewResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
