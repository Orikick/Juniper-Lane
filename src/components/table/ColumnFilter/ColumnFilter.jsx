import { useId } from 'react';
import Select from '../../ui/Select/Select';
import styles from './ColumnFilter.module.scss';

// Filter control for one TanStack column.
//   type="select": pick one of `options` (strings). The column needs filterFn: 'equalsString'.
//   type="min":    a minimum number. The column needs filterFn: 'inNumberRange'.
export default function ColumnFilter({ column, label, type = 'select', options = [], allLabel = 'All' }) {
  const id = useId();
  const value = column.getFilterValue();

  return (
    <div className={styles.filter}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      {type === 'select' && (
        <Select
          id={id}
          value={value ?? ''}
          options={[
            { value: '', label: allLabel },
            ...options.map((option) => ({ value: option, label: option })),
          ]}
          onChange={(event) => column.setFilterValue(event.target.value || undefined)}
        />
      )}

      {type === 'min' && (
        <input
          id={id}
          className={styles.input}
          type="number"
          inputMode="decimal"
          min="0"
          step="1"
          placeholder="Any"
          value={value?.[0] ?? ''}
          onChange={(event) => {
            const number = event.target.valueAsNumber;
            column.setFilterValue(Number.isNaN(number) ? undefined : [number, undefined]);
          }}
        />
      )}
    </div>
  );
}
