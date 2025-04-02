import {
  addDays,
  differenceInCalendarDays,
  isFriday,
  isSaturday,
  isSunday,
} from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const pageSizeToOffsetLimit = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  const offset = (page - 1) * size;
  const limit = size;
  return { offset, limit };
};

/**
 * Calcula la cantidad de días y noches entre dos fechas de reserva
 *
 * @param {Date} checkIn - Fecha y hora de check-in
 * @param {Date} checkOut - Fecha y hora de check-out
 * @returns {{ days: number, nights: number }} - Cantidad de días y noches de la estadía
 */
export const getDaysAndNights = (checkIn: Date, checkOut: Date) => {
  const timeZone = 'America/Bogota';

  // Convertimos las fechas a la zona horaria de Bogotá
  const checkInCol = toZonedTime(checkIn, timeZone);
  const checkOutCol = toZonedTime(checkOut, timeZone);

  // Calculamos los días de estadía (diferencia en días de calendario + 1 para incluir el primer día)
  const days = differenceInCalendarDays(checkOutCol, checkInCol) + 1;

  // Calculamos las noches (días de diferencia, porque cada noche ocurre en un día diferente)
  const nights = differenceInCalendarDays(checkOutCol, checkInCol);

  return { days, nights };
};

export const calculatePriceOfNights = (
  days: number,
  nights: number,
  pricePerNight: number,
) => {
  if (days === 1 && nights === 0) return pricePerNight;

  return nights * pricePerNight;
};

export const calculatePriceAllInclusive = (
  days: number,
  nights: number,
  quantityPeople: number,
  pricePerNight: number,
) => {
  if (days === 1 && nights === 0) return pricePerNight * quantityPeople;

  return nights * pricePerNight * quantityPeople;
};

/**
 * Calcula la cantidad de noches de fin de semana en un rango de fechas.
 *
 * @param {Date} checkIn - Fecha y hora de check-in
 * @param {Date} checkOut - Fecha y hora de check-out
 * @returns {number} - Cantidad de noches de fin de semana
 */
export const calculateTotalWeekendDays = (
  checkIn: Date,
  checkOut: Date,
): number => {
  const timeZone = 'America/Bogota';
  let weekendNights = 0;
  let currentDate = toZonedTime(checkIn, timeZone);

  // Iteramos por cada noche desde check-in hasta check-out
  while (currentDate < checkOut) {
    const nextDay = addDays(currentDate, 1);

    // Verificamos si la noche es de viernes a sábado o de sábado a domingo
    if (
      (isFriday(currentDate) && isSaturday(nextDay)) ||
      (isSaturday(currentDate) && isSunday(nextDay))
    ) {
      weekendNights++; // Incrementamos la cuenta de noches de fin de semana
    }

    // Avanzamos al siguiente día
    currentDate = nextDay;
  }

  return weekendNights;
};

export const calculateTotalWeekendIncrement = (
  basePrice: number,
  days: number,
  incrementPercent: number,
) => {
  return basePrice * (incrementPercent / 100) * days;
};

export const calculateDiscount = (nights: number) => {
  let discountPerNight = 0;

  if (nights >= 4 && nights <= 6) {
    discountPerNight = 10000;
  } else if (nights >= 7 && nights <= 9) {
    discountPerNight = 20000;
  } else if (nights > 10) {
    discountPerNight = 30000;
  }

  return discountPerNight * nights;
};

export const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
