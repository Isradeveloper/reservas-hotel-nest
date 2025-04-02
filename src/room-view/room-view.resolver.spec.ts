import { Test, TestingModule } from '@nestjs/testing';
import { RoomViewResolver } from './room-view.resolver';
import { RoomViewService } from './room-view.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CreateRoomViewInput, UpdateRoomViewInput } from './dto/inputs';

const mockRoomViews = [
  {
    id: '1',
    name: 'EXTERNA',
    isActive: true,
    createdAt: new Date('2025-04-02T01:35:10.134Z'),
    updatedAt: new Date('2025-04-02T01:35:10.134Z'),
  },
  {
    id: '2',
    name: 'INTERNA',
    isActive: true,
    createdAt: new Date('2025-04-02T01:35:10.134Z'),
    updatedAt: new Date('2025-04-02T01:35:10.134Z'),
  },
];

describe('RoomViewResolver', () => {
  let resolver: RoomViewResolver;
  let service: RoomViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [RoomViewResolver, RoomViewService],
    }).compile();

    resolver = module.get<RoomViewResolver>(RoomViewResolver);
    service = module.get<RoomViewService>(RoomViewService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create a room view and call service (create)', async () => {
    const input: CreateRoomViewInput = { name: 'MAR' };
    const spy = jest.spyOn(service, 'create').mockResolvedValue(
      Promise.resolve({
        id: '3',
        name: 'MAR',
        isActive: true,
        createdAt: new Date('2025-04-02T01:35:10.134Z'),
        updatedAt: new Date('2025-04-02T01:35:10.134Z'),
      }),
    );

    const result = await resolver.createRoomView(input);

    expect(spy).toHaveBeenCalled();
    expect(result).toEqual({
      id: '3',
      name: 'MAR',
      isActive: true,
      createdAt: new Date('2025-04-02T01:35:10.134Z'),
      updatedAt: new Date('2025-04-02T01:35:10.134Z'),
    });
  });

  it('should return an array of room views and call service (findAll)', async () => {
    const spy = jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(mockRoomViews));

    const roomViews = await resolver.findAll();

    expect(spy).toHaveBeenCalled();
    expect(roomViews).toEqual(mockRoomViews);
  });

  it('should return a single room view and call service (findOne)', async () => {
    const spy = jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(mockRoomViews[0]);

    const roomView = await resolver.findOne('1');

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('1');
    expect(roomView).toEqual(mockRoomViews[0]);
  });

  it('should update a room view and call service (update)', async () => {
    const input: UpdateRoomViewInput = {
      id: '1',
      name: 'Ocean View Updated',
    };
    const spy = jest.spyOn(service, 'update').mockResolvedValue(
      Promise.resolve({
        id: '1',
        name: 'Ocean View Updated',
        isActive: true,
        createdAt: new Date('2025-04-02T01:35:10.134Z'),
        updatedAt: new Date('2025-04-02T01:35:10.134Z'),
      }),
    );

    const result = await resolver.updateRoomView(input);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(input);
    expect(result).toEqual({
      id: '1',
      name: 'Ocean View Updated',
      isActive: true,
      createdAt: new Date('2025-04-02T01:35:10.134Z'),
      updatedAt: new Date('2025-04-02T01:35:10.134Z'),
    });
  });
});
