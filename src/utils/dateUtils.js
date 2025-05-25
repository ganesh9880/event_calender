import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  getDay,
  addDays,
  subDays,
  isSameDay,
} from 'date-fns';

export const getDaysInMonth = (date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = eachDayOfInterval({ start, end });

  // Add padding days from previous month
  const firstDayOfMonth = getDay(start);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) =>
    subDays(start, firstDayOfMonth - i)
  );

  // Add padding days from next month
  const lastDayOfMonth = getDay(end);
  const remainingPaddingDays = Array.from(
    { length: 6 - lastDayOfMonth },
    (_, i) => addDays(end, i + 1)
  );

  return [...paddingDays, ...days, ...remainingPaddingDays];
};

export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  return format(date, formatStr);
};

export const isCurrentMonth = (date, currentDate) => {
  return isSameMonth(date, currentDate);
};

export const isCurrentDay = (date) => {
  return isToday(date);
};

export const getNextMonth = (date) => {
  return addMonths(date, 1);
};

export const getPreviousMonth = (date) => {
  return subMonths(date, 1);
};

export const areDatesEqual = (date1, date2) => {
  return isSameDay(date1, date2);
};

export const getWeekDays = () => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

export const getMonthName = (date) => {
  return format(date, 'MMMM yyyy');
}; 