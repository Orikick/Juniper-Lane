import { Search, X } from 'lucide-react';
import { useId } from 'react';
import Button from '../../ui/Button/Button';
import styles from './TableToolbar.module.scss';

// Search box, filters and a "Clear" button above a DataTable.
// `children` holds the filters (usually ColumnFilter components).
export default function TableToolbar({
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  hasFilters,
  onClear,
  children,
}) {
  const searchId = useId();

  return (
    <div className={styles.toolbar}>
      <div className={styles.search}>
        <label htmlFor={searchId} className={styles.label}>
          {searchLabel}
        </label>
        <div className={styles.inputWrap}>
          <Search className={styles.icon} size={16} aria-hidden="true" />
          <input
            id={searchId}
            type="search"
            className={styles.input}
            placeholder={searchPlaceholder}
            autoComplete="off"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>

      {children}

      {hasFilters && (
        <Button variant="ghost" icon={X} className={styles.clear} onClick={onClear}>
          Clear all
        </Button>
      )}
    </div>
  );
}
