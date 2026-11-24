const LOCALE = 'en-GB';

const currencyWhole = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const currencyPrecise = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'GBP' });

const currencyCompact = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'GBP',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const wholeNumber = new Intl.NumberFormat(LOCALE);
const percent = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 1 });

const mediumDate = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' });
const shortDate = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short' });
const monthAndYear = new Intl.DateTimeFormat(LOCALE, { month: 'short', year: 'numeric' });
const longMonthAndYear = new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' });
const dateAndTime = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatCurrency = (value, { precise = false } = {}) =>
  (precise ? currencyPrecise : currencyWhole).format(value);

export const formatCompactCurrency = (value) => currencyCompact.format(value);
export const formatNumber = (value) => wholeNumber.format(value);

// Takes a fraction: 0.124 becomes "12.4%".
export const formatPercent = (value) => percent.format(value);

export const formatDate = (date) => mediumDate.format(date);
export const formatShortDate = (date) => shortDate.format(date);
export const formatMonth = (date) => monthAndYear.format(date);
export const formatLongMonth = (date) => longMonthAndYear.format(date);
export const formatDateTime = (date) => dateAndTime.format(date);

const pad = (value) => String(value).padStart(2, '0');

// Value for <input type="date">, in local time.
export const toInputDate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// Parses an <input type="date"> value as local midnight. Returns null when it is not a date.
export function fromInputDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getInitials(name = '') {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}
