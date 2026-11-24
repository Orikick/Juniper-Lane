export const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Refunded', 'Cancelled'];

export const PAYMENT_METHODS = ['Card', 'PayPal', 'Apple Pay', 'Klarna'];

// Orders in these states count towards revenue. Refunded and cancelled orders do not.
export const REVENUE_STATUSES = ['Processing', 'Shipped', 'Delivered'];

export const STATUS_TONES = {
  Processing: 'warning',
  Shipped: 'info',
  Delivered: 'success',
  Refunded: 'danger',
  Cancelled: 'neutral',
};

export const TIMEZONES = [
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Dublin', label: 'Dublin (GMT)' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Europe/Kyiv', label: 'Kyiv (EET)' },
];
