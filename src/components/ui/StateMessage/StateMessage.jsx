import { Inbox, RefreshCw, TriangleAlert } from 'lucide-react';
import { cx } from '../../../utils/cx';
import Button from '../Button/Button';
import styles from './StateMessage.module.scss';

// Shared block for empty and error states. Errors are announced immediately;
// empty states are announced politely.
export default function StateMessage({
  tone = 'empty',
  icon: IconOverride,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
}) {
  const isError = tone === 'error';
  const Icon = IconOverride ?? (isError ? TriangleAlert : Inbox);

  return (
    <div
      className={cx(styles.state, isError && styles.error, compact && styles.compact)}
      role={isError ? 'alert' : 'status'}
    >
      <span className={styles.icon}>
        <Icon size={22} aria-hidden="true" />
      </span>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {actionLabel && onAction && (
        <Button
          variant="secondary"
          size="sm"
          icon={isError ? RefreshCw : undefined}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
