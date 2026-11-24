import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, SearchX } from 'lucide-react';
import { useState } from 'react';
import { cx } from '../../../utils/cx';
import Skeleton from '../../ui/Skeleton/Skeleton';
import StateMessage from '../../ui/StateMessage/StateMessage';
import Pagination from '../Pagination/Pagination';
import styles from './DataTable.module.scss';

const SORT_LABELS = { asc: 'ascending', desc: 'descending' };

// Shared table for Orders and Customers, built on TanStack Table.
//
// - Sorting: click a column header. The header announces its sort order.
// - Column filters: pass `renderToolbar(table)` and use ColumnFilter inside it.
// - Search: done by the page before passing `data`, so it can live in the URL.
//   Set `isSearching` and `onClearSearch` so the empty state can offer to clear it.
// - Column `meta` supports `align: 'right'` and `hideBelow: 'md' | 'lg'`.
//
// `status` is 'loading', 'error' or 'success'.
export default function DataTable({
  caption,
  itemName = 'rows',
  columns,
  data,
  status,
  onRetry,
  initialSorting = [],
  pageSize = 10,
  renderToolbar,
  isSearching = false,
  onClearSearch,
  emptyState,
  getRowId,
}) {
  const [sorting, setSorting] = useState(initialSorting);
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;
  const hasFilters = columnFilters.length > 0 || isSearching;

  const clearAll = () => {
    table.resetColumnFilters();
    onClearSearch?.();
  };

  if (status === 'error') {
    return (
      <div className={styles.frame}>
        <StateMessage
          tone="error"
          title={`${caption} could not be loaded`}
          description="The request failed. Check your connection and try again."
          actionLabel="Try again"
          onAction={onRetry}
        />
      </div>
    );
  }

  const isLoading = status === 'loading';
  const isEmpty = !isLoading && data.length === 0 && !isSearching;
  const isFilteredEmpty = !isLoading && filteredCount === 0 && !isEmpty;

  return (
    <div className={styles.frame}>
      {renderToolbar && (
        <div className={styles.toolbar}>{renderToolbar(table, { clearAll, hasFilters })}</div>
      )}

      {isEmpty ? (
        emptyState
      ) : (
        <>
          <div
            className={styles.scroll}
            role="region"
            aria-label={caption}
            aria-busy={isLoading || undefined}
            tabIndex={0}
          >
            <table className={styles.table}>
              <caption className="sr-only">
                {caption}
                {isLoading ? ', loading' : `, ${filteredCount} ${itemName}`}
              </caption>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const { meta = {} } = header.column.columnDef;
                      const sorted = header.column.getIsSorted();
                      const label = flexRender(header.column.columnDef.header, header.getContext());
                      const SortIcon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown;

                      return (
                        <th
                          key={header.id}
                          scope="col"
                          aria-sort={sorted ? SORT_LABELS[sorted] : undefined}
                          className={cx(
                            meta.align === 'right' && styles.right,
                            meta.hideBelow && styles[`hideBelow-${meta.hideBelow}`],
                          )}
                        >
                          {header.column.getCanSort() ? (
                            <button
                              type="button"
                              className={cx(styles.sortButton, sorted && styles.sorted)}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {label}
                              <SortIcon size={14} aria-hidden="true" />
                            </button>
                          ) : (
                            label
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isLoading &&
                  Array.from({ length: Math.min(pageSize, 8) }, (_, rowIndex) => (
                    <tr key={`loading-${rowIndex}`} aria-hidden="true">
                      {table.getVisibleLeafColumns().map((column) => (
                        <td
                          key={column.id}
                          className={cx(
                            column.columnDef.meta?.hideBelow &&
                              styles[`hideBelow-${column.columnDef.meta.hideBelow}`],
                          )}
                        >
                          <Skeleton height={14} width={`${50 + ((rowIndex * 7 + column.getIndex() * 13) % 40)}%`} />
                        </td>
                      ))}
                    </tr>
                  ))}

                {!isLoading &&
                  rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        const { meta = {} } = cell.column.columnDef;
                        return (
                          <td
                            key={cell.id}
                            className={cx(
                              meta.align === 'right' && styles.right,
                              meta.hideBelow && styles[`hideBelow-${meta.hideBelow}`],
                            )}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {isFilteredEmpty && (
            <StateMessage
              icon={SearchX}
              compact
              title={`No ${itemName} match your search or filters`}
              description="Try a different search term, or clear the filters to see everything."
              actionLabel="Clear search and filters"
              onAction={clearAll}
            />
          )}

          {!isLoading && filteredCount > 0 && <Pagination table={table} itemName={itemName} />}
        </>
      )}
    </div>
  );
}
