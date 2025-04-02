import { formatInTimeZone } from 'date-fns-tz';

export const formatDateStringCOToUTC = (date: string): Date => {
  return new Date(date);
};

export const formatDateUTCtoStringCO = (date: Date): string => {
  return formatInTimeZone(date, 'America/Bogota', 'yyyy-MM-dd HH:mm');
};
