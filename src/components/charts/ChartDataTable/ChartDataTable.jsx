import { cx } from '../../../utils/cx';
import styles from './ChartDataTable.module.scss';

// The same figures as a chart, as a table. Shown by the "Show table" button on each chart card.
// `columns` is a list of { key, label, align, format }. The first column is the row header.
export default function ChartDataTable({ caption, columns, rows, maxHeight }) {
  return (
    <div
      className={styles.scroll}
      style={{ maxHeight }}
      role="region"
      aria-label={`${caption}, as a table`}
      tabIndex={0}
    >
      <table className={styles.table}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cx(column.align === 'right' && styles.right)}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id ?? rowIndex}>
              {columns.map((column, columnIndex) => {
                const value = row[column.key];
                const content = column.format ? column.format(value, row) : value;
                return columnIndex === 0 ? (
                  <th key={column.key} scope="row">
                    {content}
                  </th>
                ) : (
                  <td key={column.key} className={cx(column.align === 'right' && styles.right)}>
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
