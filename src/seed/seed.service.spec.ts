/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { ROOM_TYPES, ROOM_VIEWS } from './data/seed.data';
import { RoomType } from '../room-type/entities/room-type.entity';
import { RoomView } from '../room-view/entities/room-view.entity';

describe('SeedService', () => {
  let service: SeedService;
  let configService: ConfigService;
  let prismaService: PrismaService;

  const mockRoomTypes: RoomType[] = [
    {
      id: '1',
      name: 'SENCILLA',
      basePrice: 100,
      maxCapacity: 1,
      isActive: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: '2',
      name: 'DOBLE',
      basePrice: 200,
      maxCapacity: 2,
      isActive: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: '3',
      name: 'PRESIDENCIAL',
      basePrice: 300,
      maxCapacity: 4,
      isActive: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
  ];

  const mockRoomViews: RoomView[] = [
    {
      id: '1',
      name: 'INTERIOR',
      isActive: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: '2',
      name: 'EXTERIOR',
      isActive: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [
        SeedService,
        {
          provide: PrismaService,
          useValue: {
            reservation: { deleteMany: jest.fn() },
            room: {
              deleteMany: jest.fn(),
              createManyAndReturn: jest.fn(),
            },
            roomType: {
              deleteMany: jest.fn(),
              createManyAndReturn: jest.fn(),
            },
            roomView: {
              deleteMany: jest.fn(),
              createManyAndReturn: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'ENV') return process.env.ENV;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
    configService = module.get<ConfigService>(ConfigService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('executeSeed', () => {
    it('should throw error when environment is not dev', async () => {
      process.env.ENV = 'production';
      jest.spyOn(configService, 'get').mockReturnValue('production');

      await expect(service.executeSeed()).rejects.toThrow(
        'Seed can only be executed in development environment',
      );
    });

    it('should execute seed successfully when environment is dev', async () => {
      process.env.ENV = 'dev';
      jest.spyOn(configService, 'get').mockReturnValue('dev');
      jest.spyOn(service, 'deleteData').mockResolvedValue();
      jest.spyOn(service, 'createRoomTypes').mockResolvedValue(mockRoomTypes);
      jest.spyOn(service, 'createRoomViews').mockResolvedValue(mockRoomViews);
      jest.spyOn(service, 'createRoomsByType').mockResolvedValue([]);

      const result = await service.executeSeed();

      expect(result).toBe('Seed executed successfully');
      expect(service.deleteData).toHaveBeenCalled();
      expect(service.createRoomTypes).toHaveBeenCalled();
      expect(service.createRoomViews).toHaveBeenCalled();
      expect(service.createRoomsByType).toHaveBeenCalledTimes(3);
    });

    it('should throw error when room types are not found', async () => {
      process.env.ENV = 'dev';
      jest.spyOn(configService, 'get').mockImplementation(() => 'dev');
      jest.spyOn(service, 'deleteData').mockResolvedValue();
      jest.spyOn(service, 'createRoomTypes').mockResolvedValue([]);
      jest.spyOn(service, 'createRoomViews').mockResolvedValue(mockRoomViews);

      await expect(service.executeSeed()).rejects.toThrow(
        'Room types not found',
      );
    });
  });

  describe('deleteData', () => {
    it('should delete all data in correct order', async () => {
      await service.deleteData();

      expect(prismaService.reservation.deleteMany).toHaveBeenCalled();
      expect(prismaService.room.deleteMany).toHaveBeenCalled();
      expect(prismaService.roomType.deleteMany).toHaveBeenCalled();
      expect(prismaService.roomView.deleteMany).toHaveBeenCalled();
    });
  });

  describe('createRoomTypes', () => {
    it('should create room types with correct data', async () => {
      jest
        .spyOn(prismaService.roomType, 'createManyAndReturn')
        .mockResolvedValue(mockRoomTypes);

      const result = await service.createRoomTypes();

      expect(prismaService.roomType.createManyAndReturn).toHaveBeenCalledWith({
        data: ROOM_TYPES,
        skipDuplicates: true,
      });
      expect(result).toEqual(mockRoomTypes);
    });
  });

  describe('createRoomViews', () => {
    it('should create room views with correct data', async () => {
      jest
        .spyOn(prismaService.roomView, 'createManyAndReturn')
        .mockResolvedValue(mockRoomViews);

      const result = await service.createRoomViews();

      expect(prismaService.roomView.createManyAndReturn).toHaveBeenCalledWith({
        data: ROOM_VIEWS,
        skipDuplicates: true,
      });
      expect(result).toEqual(mockRoomViews);
    });
  });

  describe('createRoomsByType', () => {
    it('should create rooms for a specific type', async () => {
      const mockRooms = [
        {
          id: '1',
          number: 101,
          roomTypeId: '1',
          roomViewId: '1',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
          isActive: true,
        },
        {
          id: '2',
          number: 102,
          roomTypeId: '1',
          roomViewId: '2',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01'),
          isActive: true,
        },
      ];

      jest
        .spyOn(prismaService.room, 'createManyAndReturn')
        .mockResolvedValue(mockRooms);

      const result = await service.createRoomsByType(
        mockRoomTypes[0],
        [101, 102],
        mockRoomViews,
      );

      expect(prismaService.room.createManyAndReturn).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            roomTypeId: '1',
            number: expect.any(Number),
            roomViewId: expect.any(String),
          }),
        ]),
        skipDuplicates: true,
      });
      expect(result).toEqual(mockRooms);
    });
  });
});
