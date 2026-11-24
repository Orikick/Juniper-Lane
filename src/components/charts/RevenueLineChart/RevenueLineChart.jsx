import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { formatCompactCurrency, formatCurrency } from '../../../utils/formatters';
import ChartTooltip from '../ChartTooltip/ChartTooltip';
import { ANIMATION_MS, AXIS_LINE, AXIS_TICK, CHART_MARGIN, GRID_STROKE } from '../chartTheme';

const formatTooltipValue = (value) => formatCurrency(value);

// Revenue for the selected period as a solid line, with the previous period dashed behind it.
// `data` comes from buildTimeSeries in utils/metrics.js.
export default function RevenueLineChart({ data, height = 280, summary }) {
  const animate = !useReducedMotion();

  return (
    // The chart is drawn for sighted users; screen readers get the summary and the table view.
    <div role="img" aria-label={summary} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid vertical={false} stroke={GRID_STROKE} />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            axisLine={AXIS_LINE}
            tickLine={false}
            minTickGap={28}
            interval="preserveStartEnd"
            tickMargin={8}
          />
          <YAxis
            tickFormatter={formatCompactCurrency}
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
            width={56}
            allowDecimals={false}
          />
          <Tooltip
            content={<ChartTooltip formatValue={formatTooltipValue} reverse />}
            cursor={{ stroke: 'var(--control-border)', strokeDasharray: '3 3' }}
          />
          <Line
            type="monotone"
            dataKey="previousRevenue"
            name="Previous period"
            stroke="var(--text-3)"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            activeDot={{ r: 4, stroke: 'var(--surface)', strokeWidth: 2 }}
            isAnimationActive={animate}
            animationDuration={ANIMATION_MS}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            name="This period"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, stroke: 'var(--surface)', strokeWidth: 2 }}
            isAnimationActive={animate}
            animationDuration={ANIMATION_MS}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
