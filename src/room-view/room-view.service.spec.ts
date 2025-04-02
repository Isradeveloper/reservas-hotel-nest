/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { RoomViewService } from './room-view.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    roomView: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

describe('RoomViewService', () => {
  let service: RoomViewService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    prisma = {
      roomView: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomViewService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<RoomViewService>(RoomViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new RoomView', async () => {
      const input = { name: 'EXTERNO' };

      const mockResponse = {
        id: '1',
        name: 'EXTERNO',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      (prisma.roomView.create as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.create(input);

      expect(prisma.roomView.create).toHaveBeenCalledWith({
        data: {
          name: 'EXTERNO',
        },
      });

      expect(result).toEqual({
        id: '1',
        name: 'EXTERNO',
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw if name already exists', async () => {
      const input = { name: 'EXTERNO' };

      jest.spyOn(service, 'findOneByName').mockResolvedValueOnce({
        id: '1',
        name: 'EXTERNO',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(service.create(input)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return active RoomViews ordered by name', async () => {
      const mockData = [
        {
          id: '1',
          name: 'EXTERNO',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'INTERNO',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.roomView.findMany as jest.Mock).mockResolvedValue(mockData);

      const result = await service.findAll();

      expect(prisma.roomView.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('findOne', () => {
    it('should return a RoomView by ID', async () => {
      const mockData = {
        id: '1',
        name: 'EXTERNO',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.roomView.findUnique as jest.Mock).mockResolvedValue(mockData);

      const result = await service.findOne('1');
      expect(prisma.roomView.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockData);
    });

    it('should throw if RoomView not found', async () => {
      (prisma.roomView.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOneByName', () => {
    it('should return a RoomView by name', async () => {
      const mockData = {
        id: '1',
        name: 'EXTERNO',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.roomView.findUnique as jest.Mock).mockResolvedValue(mockData);

      const result = await service.findOneByName('EXTERNO');
      expect(prisma.roomView.findUnique).toHaveBeenCalledWith({
        where: { name: 'EXTERNO' },
      });
      expect(result).toEqual(mockData);
    });

    it('should return null if name not found', async () => {
      (prisma.roomView.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findOneByName('Unknown');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const mockUpdateInput = { id: '1', name: 'INTERNO' };
    const mockExisting = {
      id: '1',
      name: 'EXTERNO',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update a RoomView successfully', async () => {
      (prisma.roomView.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockExisting) // Para findOne
        .mockResolvedValueOnce(null); // Para findOneByName

      (prisma.roomView.update as jest.Mock).mockResolvedValue({
        ...mockExisting,
        name: 'INTERNO',
      });

      const result = await service.update(mockUpdateInput);

      expect(prisma.roomView.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'INTERNO' },
      });
      expect(result.name).toBe('INTERNO');
    });

    it('should throw if name exists in another RoomView', async () => {
      const conflictingView = { id: '2', name: 'INTERNO', isActive: true };

      (prisma.roomView.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockExisting) // Para findOne
        .mockResolvedValueOnce(conflictingView); // Para findOneByName

      await expect(service.update(mockUpdateInput)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should allow update without name change', async () => {
      (prisma.roomView.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockExisting)
        .mockResolvedValueOnce(mockExisting);

      (prisma.roomView.update as jest.Mock).mockResolvedValue(mockExisting);

      const result = await service.update({ id: '1', name: 'EXTERNO' });
      expect(result.name).toBe('EXTERNO');
    });
  });
});
