import {
  setRoomNumber,
  SINGLE_ROOMS,
  DOUBLE_ROOMS,
  PRESIDENCIAL_ROOMS,
  ROOM_TYPES,
  ROOM_VIEWS,
} from './seed.data';

describe('Seed Data', () => {
  beforeEach(() => {
    setRoomNumber(1);
  });

  describe('Generate room numbers', () => {
    test('should generate sequential room numbers 1', () => {
      const result = SINGLE_ROOMS(3);
      expect(result).toEqual([1, 2, 3]);
    });

    test('should generate sequential room numbers 2', () => {
      SINGLE_ROOMS(2);
      const result = DOUBLE_ROOMS(2);
      expect(result).toEqual([3, 4]);
    });

    test('should generate unique room numbers 3', () => {
      SINGLE_ROOMS(1);
      DOUBLE_ROOMS(1);
      const result = PRESIDENCIAL_ROOMS(2);
      expect(result).toEqual([3, 4]);
    });
  });

  describe('Configuration constants', () => {
    test('should have correct room types', () => {
      expect(ROOM_TYPES).toEqual([
        {
          name: 'SENCILLA',
          basePrice: 60000,
          maxCapacity: 1,
        },
        {
          name: 'DOBLE',
          basePrice: 100000,
          maxCapacity: 2,
        },
        {
          name: 'PRESIDENCIAL',
          basePrice: 160000,
          maxCapacity: 4,
        },
      ]);
    });

    test('should have correct room views', () => {
      expect(ROOM_VIEWS).toEqual([{ name: 'EXTERIOR' }, { name: 'INTERIOR' }]);
    });

    test('should have positive base prices', () => {
      ROOM_TYPES.forEach((type) => {
        expect(type.basePrice).toBeGreaterThan(0);
      });
    });
  });

  describe('should reset room number', () => {
    test('should reset room number', () => {
      setRoomNumber(1);
      expect(SINGLE_ROOMS(1)).toEqual([1]);
    });
  });
});
