import { STATUS_TONES } from '../../../data/orderOptions';
import { cx } from '../../../utils/cx';
import styles from './StatusBadge.module.scss';

// The status is always written out, so colour is never the only signal.
export default function StatusBadge({ status }) {
  const tone = STATUS_TONES[status] ?? 'neutral';

  return (
    <span className={cx(styles.badge, styles[tone])}>
      <span className={styles.dot} aria-hidden="true" />
      {status}
    </span>
  );
}
