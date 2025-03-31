import { Test, TestingModule } from '@nestjs/testing';
import { RoomViewService } from './room-view.service';

describe('RoomViewService', () => {
  let service: RoomViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomViewService],
    }).compile();

    service = module.get<RoomViewService>(RoomViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
