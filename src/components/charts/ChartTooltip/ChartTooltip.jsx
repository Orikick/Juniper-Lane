import styles from './ChartTooltip.module.scss';

// Custom tooltip shared by all three charts. Recharts passes `active` and `payload`.
// `formatValue(value, entry)` formats each figure; `getTitle(row)` sets the heading.
export default function ChartTooltip({
  active,
  payload,
  formatValue = (value) => value,
  getTitle = (row) => row.longLabel,
  reverse = false,
}) {
  if (!active || !payload || payload.length === 0) return null;

  const row = payload[0].payload;
  const title = getTitle(row);
  const entries = payload.filter((entry) => entry.value !== null && entry.value !== undefined);
  if (reverse) entries.reverse();

  return (
    <div className={styles.tooltip}>
      {title && <p className={styles.title}>{title}</p>}
      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.dataKey ?? entry.name} className={styles.row}>
            <span
              className={styles.swatch}
              style={{ background: entry.color ?? entry.payload?.color }}
              aria-hidden="true"
            />
            <span className={styles.name}>{entry.name}</span>
            <span className={styles.value}>{formatValue(entry.value, entry)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
