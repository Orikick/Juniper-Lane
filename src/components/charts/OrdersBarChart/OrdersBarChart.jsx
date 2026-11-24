import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { formatNumber } from '../../../utils/formatters';
import ChartTooltip from '../ChartTooltip/ChartTooltip';
import { ANIMATION_MS, AXIS_LINE, AXIS_TICK, CHART_MARGIN, GRID_STROKE } from '../chartTheme';

const formatTooltipValue = (value) => formatNumber(value);

// Number of orders per day, week or month. `data` comes from buildTimeSeries.
export default function OrdersBarChart({ data, height = 260, summary }) {
  const animate = !useReducedMotion();

  return (
    <div role="img" aria-label={summary} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={data} margin={CHART_MARGIN} barCategoryGap="20%">
          <CartesianGrid vertical={false} stroke={GRID_STROKE} />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            axisLine={AXIS_LINE}
            tickLine={false}
            minTickGap={20}
            interval="preserveStartEnd"
            tickMargin={8}
          />
          <YAxis
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
            width={36}
            allowDecimals={false}
          />
          <Tooltip
            content={<ChartTooltip formatValue={formatTooltipValue} />}
            cursor={{ fill: 'var(--chart-cursor)' }}
          />
          <Bar
            dataKey="orders"
            name="Orders"
            fill="var(--chart-2)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
            isAnimationActive={animate}
            animationDuration={ANIMATION_MS}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
