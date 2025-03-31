import { differenceInCalendarDays } from 'date-fns';
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
