import { useMemo } from 'react';
import { getOrders } from '../api/fakeApi';
import { useDateRange } from '../context/DateRangeContext';
import { filterByRange } from '../utils/metrics';
import { useAsync } from './useAsync';

const EMPTY = [];

// Loads all orders once, then slices them for the selected period and the one
// before it. Changing the date range recalculates the slices without refetching.
export function useOrdersInRange() {
  const { range, previousRange } = useDateRange();
  const { status, data, error, reload } = useAsync(getOrders);

  const slices = useMemo(() => {
    if (!data) return { all: EMPTY, current: EMPTY, previous: EMPTY };
    return {
      all: data,
      current: filterByRange(data, range),
      previous: filterByRange(data, previousRange),
    };
  }, [data, range, previousRange]);

  return { status, error, reload, ...slices };
}
