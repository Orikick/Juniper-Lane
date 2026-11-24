import { createContext, useContext, useMemo, useState } from 'react';
import { DATE_PRESETS, DEFAULT_PRESET_ID } from '../data/dateRanges';
import {
  describeRange,
  diffInDays,
  endOfDay,
  isWithinRange,
  previousRange,
  rangeForLastDays,
  rangeLength,
  startOfDay,
} from '../utils/dateRange';

const DateRangeContext = createContext(null);

// Holds the period chosen in the top bar. Every chart, KPI and the orders table read it.
export function DateRangeProvider({ children }) {
  const [today] = useState(() => startOfDay(new Date()));
  const [selection, setSelection] = useState({ presetId: DEFAULT_PRESET_ID, custom: null });

  const value = useMemo(() => {
    const preset = DATE_PRESETS.find((item) => item.id === selection.presetId);
    const range = preset ? rangeForLastDays(preset.days, today) : selection.custom;
    const days = rangeLength(range);

    const setPreset = (presetId) => setSelection({ presetId, custom: null });
    const setCustomRange = (from, to) =>
      setSelection({ presetId: 'custom', custom: { from: startOfDay(from), to: endOfDay(to) } });

    // Widens the range so it contains `date`. Used when a link points at an order
    // outside the current range, so the order is on the page that opens.
    const includeDate = (date) => {
      if (isWithinRange(date, range)) return;
      const age = diffInDays(date, today) + 1;
      const wider = DATE_PRESETS.find((item) => item.days >= age);
      if (wider) setPreset(wider.id);
      else setCustomRange(date, today);
    };

    return {
      today,
      presetId: preset ? preset.id : 'custom',
      range,
      previousRange: previousRange(range),
      label: preset ? preset.label : describeRange(range),
      // "Last 30 days (18 Oct to 16 Nov 2026)", or just the dates for a custom range.
      summary: preset ? `${preset.label} (${describeRange(range)})` : describeRange(range),
      comparisonLabel: preset
        ? preset.comparison
        : `previous ${days} ${days === 1 ? 'day' : 'days'}`,
      setPreset,
      setCustomRange,
      includeDate,
    };
  }, [selection, today]);

  return <DateRangeContext.Provider value={value}>{children}</DateRangeContext.Provider>;
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (!context) throw new Error('useDateRange must be used inside DateRangeProvider');
  return context;
}
