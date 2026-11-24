import { cx } from '../../../utils/cx';
import styles from './Switch.module.scss';

// An on/off control with its label and description on the left.
export default function Switch({ id, label, description, checked, onChange, disabled = false }) {
  const labelId = `${id}-label`;
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className={styles.row}>
      <div className={styles.text}>
        <span id={labelId} className={styles.label}>
          {label}
        </span>
        {description && (
          <span id={descriptionId} className={styles.description}>
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        disabled={disabled}
        className={cx(styles.switch, checked && styles.on)}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.thumb} aria-hidden="true" />
      </button>
    </div>
  );
}
