import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useId } from 'react';
import { formatNumber } from '../../../utils/formatters';
import IconButton from '../../ui/IconButton/IconButton';
import Select from '../../ui/Select/Select';
import styles from './Pagination.module.scss';

const PAGE_SIZES = [10, 25, 50];

export default function Pagination({ table, itemName }) {
  const sizeId = useId();
  const { pageIndex, pageSize } = table.getState().pagination;
  const total = table.getFilteredRowModel().rows.length;
  const first = total === 0 ? 0 : pageIndex * pageSize + 1;
  const last = Math.min(total, (pageIndex + 1) * pageSize);
  const pageCount = Math.max(1, table.getPageCount());

  return (
    <nav className={styles.bar} aria-label={`${itemName} pages`}>
      <p className={styles.summary} aria-live="polite">
        Showing {formatNumber(first)} to {formatNumber(last)} of {formatNumber(total)} {itemName}
      </p>

      <div className={styles.controls}>
        <div className={styles.size}>
          <label htmlFor={sizeId}>Rows per page</label>
          <Select
            id={sizeId}
            size="sm"
            value={pageSize}
            options={PAGE_SIZES.map((size) => ({ value: size, label: String(size) }))}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
          />
        </div>

        <span className={styles.page}>
          Page {pageIndex + 1} of {pageCount}
        </span>

        <div className={styles.buttons}>
          <IconButton
            label="First page"
            icon={ChevronsLeft}
            className={styles.edge}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.firstPage()}
          />
          <IconButton
            label="Previous page"
            icon={ChevronLeft}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          />
          <IconButton
            label="Next page"
            icon={ChevronRight}
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          />
          <IconButton
            label="Last page"
            icon={ChevronsRight}
            className={styles.edge}
            disabled={!table.getCanNextPage()}
            onClick={() => table.lastPage()}
          />
        </div>
      </div>
    </nav>
  );
}
