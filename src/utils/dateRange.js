import { formatDate, formatShortDate } from './formatters';

const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function endOfDay(date) {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

// setDate keeps the local time of day, so this is safe across daylight-saving changes.
export function addDays(date, amount) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

// Whole calendar days from one date to another, ignoring the time of day.
export function diffInDays(from, to) {
  return Math.round((startOfDay(to) - startOfDay(from)) / DAY_MS);
}

export function rangeLength(range) {
  return diffInDays(range.from, range.to) + 1;
}

export function rangeForLastDays(days, today = new Date()) {
  return { from: startOfDay(addDays(today, -(days - 1))), to: endOfDay(today) };
}

// The period of the same length that ends the day before this one starts.
export function previousRange(range) {
  const length = rangeLength(range);
  return {
    from: startOfDay(addDays(range.from, -length)),
    to: endOfDay(addDays(range.from, -1)),
  };
}

export function isWithinRange(date, range) {
  return date >= range.from && date <= range.to;
}

export function describeRange(range) {
  const sameYear = range.from.getFullYear() === range.to.getFullYear();
  const from = sameYear ? formatShortDate(range.from) : formatDate(range.from);
  return `${from} to ${formatDate(range.to)}`;
}
