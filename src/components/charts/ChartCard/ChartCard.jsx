import { ChartColumn, ChartNoAxesColumn, Table2 } from 'lucide-react';
import { useId, useState } from 'react';
import { cx } from '../../../utils/cx';
import Button from '../../ui/Button/Button';
import Card from '../../ui/Card/Card';
import Skeleton from '../../ui/Skeleton/Skeleton';
import StateMessage from '../../ui/StateMessage/StateMessage';
import styles from './ChartCard.module.scss';

// Frame for every chart: title, legend, a chart/table switch, and the loading,
// empty and error states. `status` is 'loading', 'error', 'empty' or 'ready'.
// `legend` is a list of { label, color, dashed }.
export default function ChartCard({
  title,
  description,
  status,
  onRetry,
  legend,
  table,
  height = 280,
  emptyTitle = 'No orders in this period',
  emptyDescription = 'Choose a longer date range to see sales here.',
  className,
  children,
}) {
  const [showTable, setShowTable] = useState(false);
  const titleId = useId();
  const isReady = status === 'ready';

  return (
    <Card as="section" className={cx(styles.card, className)} aria-labelledby={titleId}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {isReady && table && (
          <Button
            variant="ghost"
            size="sm"
            icon={showTable ? ChartNoAxesColumn : Table2}
            aria-pressed={showTable}
            onClick={() => setShowTable((value) => !value)}
          >
            {showTable ? 'Show chart' : 'Show table'}
          </Button>
        )}
      </header>

      {isReady && legend && !showTable && (
        <ul className={styles.legend}>
          {legend.map((item) => (
            <li key={item.label} className={styles.legendItem}>
              <span
                className={cx(styles.legendKey, item.dashed && styles.dashed)}
                style={{ '--key-color': item.color }}
                aria-hidden="true"
              />
              {item.label}
            </li>
          ))}
        </ul>
      )}

      <div className={styles.body} style={{ minHeight: height }}>
        {status === 'loading' && (
          <div className={styles.loading} role="status">
            <span className="sr-only">Loading {title.toLowerCase()}</span>
            <Skeleton height={height} radius="var(--radius-s)" />
          </div>
        )}
        {status === 'error' && (
          <StateMessage
            tone="error"
            title={`${title} could not be loaded`}
            description="The request failed. Check your connection and try again."
            actionLabel="Try again"
            onAction={onRetry}
          />
        )}
        {status === 'empty' && (
          <StateMessage icon={ChartColumn} title={emptyTitle} description={emptyDescription} />
        )}
        {isReady && (showTable ? table : children)}
      </div>
    </Card>
  );
}
