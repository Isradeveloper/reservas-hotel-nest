let roomNumber = 1;

export const ROOM_TYPES = [
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
];

export const ROOM_VIEWS = [
  {
    name: 'EXTERIOR',
  },
  {
    name: 'INTERIOR',
  },
];

export const SINGLE_ROOMS = (quantity: number) => {
  const numberRooms: number[] = [];

  for (let i = 0; i < quantity; i++) {
    numberRooms.push(roomNumber++);
  }

  return numberRooms;
};

export const DOUBLE_ROOMS = (quantity: number) => {
  const numberRooms: number[] = [];

  for (let i = 0; i < quantity; i++) {
    numberRooms.push(roomNumber++);
  }

  return numberRooms;
};

export const PRESIDENCIAL_ROOMS = (quantity: number) => {
  const numberRooms: number[] = [];

  for (let i = 0; i < quantity; i++) {
    numberRooms.push(roomNumber++);
  }

  return numberRooms;
};
