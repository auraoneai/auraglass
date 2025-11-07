/**
 * Date Adapters
 * Provides adapters for different date libraries (date-fns, dayjs, luxon, etc.)
 */

/**
 * Date adapter interface
 */
export interface DateAdapter {
  format: (date: Date | number | string, formatStr: string) => string;
  parse: (dateStr: string, formatStr: string) => Date;
  isValid: (date: any) => boolean;
  addDays: (date: Date, days: number) => Date;
  addMonths: (date: Date, months: number) => Date;
  addYears: (date: Date, years: number) => Date;
  startOfDay: (date: Date) => Date;
  startOfWeek: (date: Date) => Date;
  startOfMonth: (date: Date) => Date;
  startOfYear: (date: Date) => Date;
  endOfDay: (date: Date) => Date;
  endOfWeek: (date: Date) => Date;
  endOfMonth: (date: Date) => Date;
  endOfYear: (date: Date) => Date;
  isBefore: (date: Date, dateToCompare: Date) => boolean;
  isAfter: (date: Date, dateToCompare: Date) => boolean;
  isSameDay: (date: Date, dateToCompare: Date) => boolean;
  getDaysInMonth: (date: Date) => number;
}

/**
 * Create date-fns adapter
 * Requires date-fns to be installed: npm install date-fns
 */
export const createDateFnsAdapter = (): DateAdapter => {
  let dateFns: any;

  try {
    // Dynamic import to avoid bundling if not used
    dateFns = require('date-fns');
  } catch (e) {
    throw new Error(
      'date-fns is not installed. Please install it: npm install date-fns'
    );
  }

  return {
    format: (date: Date | number | string, formatStr: string): string => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateFns.format(dateObj, formatStr);
    },

    parse: (dateStr: string, formatStr: string): Date => {
      return dateFns.parse(dateStr, formatStr, new Date());
    },

    isValid: (date: any): boolean => {
      return dateFns.isValid(new Date(date));
    },

    addDays: (date: Date, days: number): Date => {
      return dateFns.addDays(date, days);
    },

    addMonths: (date: Date, months: number): Date => {
      return dateFns.addMonths(date, months);
    },

    addYears: (date: Date, years: number): Date => {
      return dateFns.addYears(date, years);
    },

    startOfDay: (date: Date): Date => {
      return dateFns.startOfDay(date);
    },

    startOfWeek: (date: Date): Date => {
      return dateFns.startOfWeek(date);
    },

    startOfMonth: (date: Date): Date => {
      return dateFns.startOfMonth(date);
    },

    startOfYear: (date: Date): Date => {
      return dateFns.startOfYear(date);
    },

    endOfDay: (date: Date): Date => {
      return dateFns.endOfDay(date);
    },

    endOfWeek: (date: Date): Date => {
      return dateFns.endOfWeek(date);
    },

    endOfMonth: (date: Date): Date => {
      return dateFns.endOfMonth(date);
    },

    endOfYear: (date: Date): Date => {
      return dateFns.endOfYear(date);
    },

    isBefore: (date: Date, dateToCompare: Date): boolean => {
      return dateFns.isBefore(date, dateToCompare);
    },

    isAfter: (date: Date, dateToCompare: Date): boolean => {
      return dateFns.isAfter(date, dateToCompare);
    },

    isSameDay: (date: Date, dateToCompare: Date): boolean => {
      return dateFns.isSameDay(date, dateToCompare);
    },

    getDaysInMonth: (date: Date): number => {
      return dateFns.getDaysInMonth(date);
    },
  };
};

/**
 * Create Day.js adapter
 * Requires dayjs to be installed: npm install dayjs
 */
export const createDayJsAdapter = (): DateAdapter => {
  let dayjs: any;

  try {
    dayjs = require('dayjs');
  } catch (e) {
    throw new Error(
      'dayjs is not installed. Please install it: npm install dayjs'
    );
  }

  return {
    format: (date: Date | number | string, formatStr: string): string => {
      return dayjs(date).format(formatStr);
    },

    parse: (dateStr: string, formatStr: string): Date => {
      return dayjs(dateStr, formatStr).toDate();
    },

    isValid: (date: any): boolean => {
      return dayjs(date).isValid();
    },

    addDays: (date: Date, days: number): Date => {
      return dayjs(date).add(days, 'day').toDate();
    },

    addMonths: (date: Date, months: number): Date => {
      return dayjs(date).add(months, 'month').toDate();
    },

    addYears: (date: Date, years: number): Date => {
      return dayjs(date).add(years, 'year').toDate();
    },

    startOfDay: (date: Date): Date => {
      return dayjs(date).startOf('day').toDate();
    },

    startOfWeek: (date: Date): Date => {
      return dayjs(date).startOf('week').toDate();
    },

    startOfMonth: (date: Date): Date => {
      return dayjs(date).startOf('month').toDate();
    },

    startOfYear: (date: Date): Date => {
      return dayjs(date).startOf('year').toDate();
    },

    endOfDay: (date: Date): Date => {
      return dayjs(date).endOf('day').toDate();
    },

    endOfWeek: (date: Date): Date => {
      return dayjs(date).endOf('week').toDate();
    },

    endOfMonth: (date: Date): Date => {
      return dayjs(date).endOf('month').toDate();
    },

    endOfYear: (date: Date): Date => {
      return dayjs(date).endOf('year').toDate();
    },

    isBefore: (date: Date, dateToCompare: Date): boolean => {
      return dayjs(date).isBefore(dayjs(dateToCompare));
    },

    isAfter: (date: Date, dateToCompare: Date): boolean => {
      return dayjs(date).isAfter(dayjs(dateToCompare));
    },

    isSameDay: (date: Date, dateToCompare: Date): boolean => {
      return dayjs(date).isSame(dayjs(dateToCompare), 'day');
    },

    getDaysInMonth: (date: Date): number => {
      return dayjs(date).daysInMonth();
    },
  };
};

/**
 * Create native Date adapter (no dependencies)
 */
export const createNativeDateAdapter = (): DateAdapter => {
  return {
    format: (date: Date | number | string, formatStr: string): string => {
      const dateObj = new Date(date);
      // Simple format implementation
      return dateObj.toLocaleDateString();
    },

    parse: (dateStr: string, formatStr: string): Date => {
      return new Date(dateStr);
    },

    isValid: (date: any): boolean => {
      const d = new Date(date);
      return d instanceof Date && !isNaN(d.getTime());
    },

    addDays: (date: Date, days: number): Date => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    },

    addMonths: (date: Date, months: number): Date => {
      const result = new Date(date);
      result.setMonth(result.getMonth() + months);
      return result;
    },

    addYears: (date: Date, years: number): Date => {
      const result = new Date(date);
      result.setFullYear(result.getFullYear() + years);
      return result;
    },

    startOfDay: (date: Date): Date => {
      const result = new Date(date);
      result.setHours(0, 0, 0, 0);
      return result;
    },

    startOfWeek: (date: Date): Date => {
      const result = new Date(date);
      const day = result.getDay();
      const diff = result.getDate() - day;
      result.setDate(diff);
      result.setHours(0, 0, 0, 0);
      return result;
    },

    startOfMonth: (date: Date): Date => {
      const result = new Date(date);
      result.setDate(1);
      result.setHours(0, 0, 0, 0);
      return result;
    },

    startOfYear: (date: Date): Date => {
      const result = new Date(date);
      result.setMonth(0, 1);
      result.setHours(0, 0, 0, 0);
      return result;
    },

    endOfDay: (date: Date): Date => {
      const result = new Date(date);
      result.setHours(23, 59, 59, 999);
      return result;
    },

    endOfWeek: (date: Date): Date => {
      const result = new Date(date);
      const day = result.getDay();
      const diff = 6 - day;
      result.setDate(result.getDate() + diff);
      result.setHours(23, 59, 59, 999);
      return result;
    },

    endOfMonth: (date: Date): Date => {
      const result = new Date(date);
      result.setMonth(result.getMonth() + 1, 0);
      result.setHours(23, 59, 59, 999);
      return result;
    },

    endOfYear: (date: Date): Date => {
      const result = new Date(date);
      result.setMonth(11, 31);
      result.setHours(23, 59, 59, 999);
      return result;
    },

    isBefore: (date: Date, dateToCompare: Date): boolean => {
      return date.getTime() < dateToCompare.getTime();
    },

    isAfter: (date: Date, dateToCompare: Date): boolean => {
      return date.getTime() > dateToCompare.getTime();
    },

    isSameDay: (date: Date, dateToCompare: Date): boolean => {
      return (
        date.getFullYear() === dateToCompare.getFullYear() &&
        date.getMonth() === dateToCompare.getMonth() &&
        date.getDate() === dateToCompare.getDate()
      );
    },

    getDaysInMonth: (date: Date): number => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    },
  };
};
