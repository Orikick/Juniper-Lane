import KpiCard, { KpiCardSkeleton } from '../KpiCard/KpiCard';
import styles from './KpiGrid.module.scss';

// The four headline figures. A description list pairs each label with its value
// for screen readers.
export default function KpiGrid({ kpis, comparisonLabel, loading = false }) {
  if (loading) {
    return (
      <div className={styles.grid} role="status">
        <span className="sr-only">Loading key figures</span>
        {Array.from({ length: 4 }, (_, index) => (
          <KpiCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <dl className={styles.grid} aria-label="Key figures">
      {kpis.map((kpi, index) => (
        <KpiCard
          key={kpi.id}
          label={kpi.label}
          value={kpi.value}
          change={kpi.change}
          comparisonLabel={comparisonLabel}
          featured={index === 0}
        />
      ))}
    </dl>
  );
}
