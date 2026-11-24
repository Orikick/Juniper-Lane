import { cx } from '../../../utils/cx';
import styles from './Spinner.module.scss';

// Pass `label` when the spinner stands alone, so screen readers announce what is loading.
export default function Spinner({ size = 'md', label }) {
  return (
    <span
      className={cx(styles.spinner, styles[size])}
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : true}
    >
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
