import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { cx } from '../../../utils/cx';
import { formatCompactCurrency, formatCurrency, formatPercent } from '../../../utils/formatters';
import { ANIMATION_MS } from '../chartTheme';
import styles from './CategoryDonutChart.module.scss';

// Share of revenue by product category. The list beside the ring repeats every
// figure in text, so the chart never relies on colour alone.
//
// There is no floating tooltip: the ring is too small for one to fit without
// covering the centre. Hovering a slice, or its row in the list, shows that
// category in the centre of the ring and highlights it in both places.
//
// `data` comes from buildCategoryBreakdown in utils/metrics.js.
export default function CategoryDonutChart({ data, total, summary }) {
  const animate = !useReducedMotion();
  const [activeId, setActiveId] = useState(null);
  const active = data.find((slice) => slice.id === activeId) ?? null;
  const clearActive = () => setActiveId(null);

  return (
    <div className={styles.layout}>
      <div className={styles.ring} role="img" aria-label={summary}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="64%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              stroke="var(--surface)"
              strokeWidth={2}
              isAnimationActive={animate}
              animationDuration={ANIMATION_MS}
              onMouseEnter={(_, index) => setActiveId(data[index]?.id ?? null)}
              onMouseLeave={clearActive}
            >
              {data.map((slice) => (
                <Cell
                  key={slice.id}
                  fill={slice.color}
                  fillOpacity={active && active.id !== slice.id ? 0.3 : 1}
                  className={styles.slice}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.centre} aria-hidden="true">
          <span className={styles.centreValue}>
            {formatCompactCurrency(active ? active.value : total)}
          </span>
          <span className={styles.centreLabel}>{active ? active.name : 'Revenue'}</span>
          {active && <span className={styles.centreShare}>{formatPercent(active.share)}</span>}
        </div>
      </div>

      <ul className={styles.list} onMouseLeave={clearActive}>
        {data.map((slice) => (
          <li
            key={slice.id}
            className={cx(styles.item, active?.id === slice.id && styles.active)}
            onMouseEnter={() => setActiveId(slice.id)}
          >
            <span className={styles.swatch} style={{ background: slice.color }} aria-hidden="true" />
            <span className={styles.name}>{slice.name}</span>
            <span className={styles.share}>{formatPercent(slice.share)}</span>
            <span className={styles.value}>{formatCurrency(slice.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
