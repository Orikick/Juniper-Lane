import { REVENUE_STATUSES } from '../data/orderOptions';
import { addDays, diffInDays, isWithinRange, rangeLength, startOfDay } from './dateRange';
import {
  formatCurrency,
  formatDate,
  formatLongMonth,
  formatMonth,
  formatNumber,
  formatShortDate,
} from './formatters';

const revenueStatuses = new Set(REVENUE_STATUSES);

export const countsAsRevenue = (order) => revenueStatuses.has(order.status);

export const filterByRange = (orders, range) =>
  orders.filter((order) => isWithinRange(order.placedAt, range));

export function summarise(orders) {
  const paid = orders.filter(countsAsRevenue);
  const revenue = paid.reduce((sum, order) => sum + order.total, 0);
  return {
    revenue,
    orders: orders.length,
    averageOrderValue: paid.length > 0 ? revenue / paid.length : 0,
  };
}

// Fractional change against the previous value, or null when there is nothing to compare with.
export function relativeChange(current, previous) {
  if (!previous) return null;
  return (current - previous) / previous;
}

// A customer is "new" in the period that contains their first ever order.
function countNewCustomers(allOrders, ranges) {
  const firstOrder = new Map();
  for (const order of allOrders) {
    const known = firstOrder.get(order.customerId);
    if (!known || order.placedAt < known) firstOrder.set(order.customerId, order.placedAt);
  }
  return ranges.map((range) => {
    let count = 0;
    for (const date of firstOrder.values()) {
      if (isWithinRange(date, range)) count += 1;
    }
    return count;
  });
}

export function buildKpis({ all, current, previous, range, previousRange }) {
  const now = summarise(current);
  const before = summarise(previous);
  const [newNow, newBefore] = countNewCustomers(all, [range, previousRange]);

  return [
    {
      id: 'revenue',
      label: 'Revenue',
      value: formatCurrency(now.revenue),
      change: relativeChange(now.revenue, before.revenue),
    },
    {
      id: 'orders',
      label: 'Orders',
      value: formatNumber(now.orders),
      change: relativeChange(now.orders, before.orders),
    },
    {
      id: 'averageOrderValue',
      label: 'Average order value',
      value: formatCurrency(now.averageOrderValue, { precise: true }),
      change: relativeChange(now.averageOrderValue, before.averageOrderValue),
    },
    {
      id: 'newCustomers',
      label: 'New customers',
      value: formatNumber(newNow),
      change: relativeChange(newNow, newBefore),
    },
  ];
}

// Short ranges are charted by day, medium ranges by week, long ranges by month.
export function getGranularity(range) {
  const days = rangeLength(range);
  if (days <= 31) return 'day';
  if (days <= 120) return 'week';
  return 'month';
}

function createBuckets(range, granularity) {
  const buckets = [];

  if (granularity === 'month') {
    let cursor = new Date(range.from.getFullYear(), range.from.getMonth(), 1);
    while (cursor <= range.to) {
      buckets.push({ label: formatMonth(cursor), longLabel: formatLongMonth(cursor) });
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }
    return buckets;
  }

  const step = granularity === 'week' ? 7 : 1;
  for (let start = startOfDay(range.from); start <= range.to; start = addDays(start, step)) {
    buckets.push({
      label: formatShortDate(start),
      longLabel: step === 7 ? `Week of ${formatDate(start)}` : formatDate(start),
    });
  }
  return buckets;
}

function bucketIndex(date, range, granularity) {
  if (granularity === 'month') {
    return (
      (date.getFullYear() - range.from.getFullYear()) * 12 + date.getMonth() - range.from.getMonth()
    );
  }
  const days = diffInDays(range.from, date);
  return granularity === 'week' ? Math.floor(days / 7) : days;
}

function aggregate(orders, range, granularity, size) {
  const totals = Array.from({ length: size }, () => ({ revenue: 0, orders: 0 }));
  for (const order of orders) {
    const index = bucketIndex(order.placedAt, range, granularity);
    if (index < 0 || index >= size) continue;
    totals[index].orders += 1;
    if (countsAsRevenue(order)) totals[index].revenue += order.total;
  }
  return totals;
}

// One row per bucket, with the matching bucket of the previous period alongside.
export function buildTimeSeries({ current, previous, range, previousRange }) {
  const granularity = getGranularity(range);
  const buckets = createBuckets(range, granularity);
  const previousBuckets = createBuckets(previousRange, granularity);
  const now = aggregate(current, range, granularity, buckets.length);
  const before = aggregate(previous, previousRange, granularity, previousBuckets.length);

  return buckets.map((bucket, index) => ({
    ...bucket,
    revenue: now[index].revenue,
    orders: now[index].orders,
    previousRevenue: before[index] ? before[index].revenue : null,
  }));
}

export function buildCategoryBreakdown(orders, categories) {
  const totals = new Map(categories.map((category) => [category.id, 0]));
  for (const order of orders) {
    if (!countsAsRevenue(order)) continue;
    for (const item of order.items) {
      totals.set(item.category, (totals.get(item.category) ?? 0) + item.qty * item.price);
    }
  }
  const total = [...totals.values()].reduce((sum, value) => sum + value, 0);

  // Colour follows the category's fixed position, so a category keeps its colour in every range.
  return categories.map((category, index) => {
    const value = totals.get(category.id) ?? 0;
    return {
      id: category.id,
      name: category.name,
      value,
      share: total > 0 ? value / total : 0,
      color: `var(--chart-${index + 1})`,
    };
  });
}
