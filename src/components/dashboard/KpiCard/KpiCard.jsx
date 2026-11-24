import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cx } from '../../../utils/cx';
import { formatPercent } from '../../../utils/formatters';
import Skeleton from '../../ui/Skeleton/Skeleton';
import styles from './KpiCard.module.scss';

function describeChange(change) {
  if (change === null) return { tone: 'flat', icon: Minus, text: 'No data' };
  const rounded = Math.round(change * 1000) / 1000;
  if (rounded > 0) return { tone: 'up', icon: ArrowUpRight, text: `+${formatPercent(rounded)}` };
  if (rounded < 0) return { tone: 'down', icon: ArrowDownRight, text: formatPercent(rounded) };
  return { tone: 'flat', icon: Minus, text: '0%' };
}

// One headline figure with its change against the previous period.
// The change is written out ("+12.4%") with an arrow, so colour is never the only cue.
export default function KpiCard({ label, value, change, comparisonLabel, featured = false }) {
  const { tone, icon: Icon, text } = describeChange(change);

  return (
    <div className={cx(styles.card, featured && styles.featured)}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>{value}</dd>
      <dd className={styles.footer}>
        <span className={cx(styles.change, styles[tone])}>
          <Icon size={14} aria-hidden="true" />
          {text}
        </span>
        <span className={styles.comparison}>vs {comparisonLabel}</span>
      </dd>
    </div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <Skeleton width="45%" height={14} />
      <Skeleton width="65%" height={30} className={styles.skeletonValue} />
      <Skeleton width="80%" height={14} />
    </div>
  );
}
