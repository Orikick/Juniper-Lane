import { cx } from '../../../utils/cx';
import styles from './Skeleton.module.scss';

// Grey placeholder shown while content loads. Hidden from screen readers:
// the surrounding region announces the loading state instead.
export default function Skeleton({ width = '100%', height = 16, radius, className }) {
  return (
    <span
      className={cx(styles.skeleton, className)}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}
