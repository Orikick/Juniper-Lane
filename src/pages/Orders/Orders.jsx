import { ShoppingBag } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ColumnFilter from '../../components/table/ColumnFilter/ColumnFilter';
import DataTable from '../../components/table/DataTable/DataTable';
import TableToolbar from '../../components/table/TableToolbar/TableToolbar';
import PageHeader from '../../components/ui/PageHeader/PageHeader';
import StateMessage from '../../components/ui/StateMessage/StateMessage';
import StatusBadge from '../../components/ui/StatusBadge/StatusBadge';
import { useDateRange } from '../../context/DateRangeContext';
import { ORDER_STATUSES, PAYMENT_METHODS } from '../../data/orderOptions';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useOrdersInRange } from '../../hooks/useOrdersInRange';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import styles from './Orders.module.scss';

const columns = [
  {
    accessorKey: 'id',
    header: 'Order',
    cell: ({ getValue }) => <span className={styles.orderId}>{getValue()}</span>,
  },
  {
    accessorKey: 'placedAt',
    header: 'Placed',
    sortingFn: 'datetime',
    sortDescFirst: true,
    cell: ({ getValue }) => formatDateTime(getValue()),
    meta: { hideBelow: 'md' },
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
    cell: ({ row }) => (
      <Link to={`/customers?customer=${encodeURIComponent(row.original.customerId)}`}>
        {row.original.customerName}
      </Link>
    ),
  },
  {
    accessorKey: 'itemCount',
    header: 'Items',
    sortDescFirst: true,
    meta: { align: 'right', hideBelow: 'lg' },
  },
  {
    accessorKey: 'payment',
    header: 'Payment',
    filterFn: 'equalsString',
    meta: { hideBelow: 'lg' },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: 'equalsString',
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  },
  {
    accessorKey: 'total',
    header: 'Total',
    filterFn: 'inNumberRange',
    sortDescFirst: true,
    cell: ({ getValue }) => formatCurrency(getValue(), { precise: true }),
    meta: { align: 'right' },
  },
];

const matchesSearch = (order, term) =>
  order.id.toLowerCase().includes(term) || order.customerName.toLowerCase().includes(term);

export default function Orders() {
  useDocumentTitle('Orders');
  const { summary } = useDateRange();
  const { status, reload, current } = useOrdersInRange();

  // The search lives in the URL, so the top-bar search and the drawer can link straight to it.
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const setQuery = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('q', value);
    else next.delete('q');
    setSearchParams(next, { replace: true });
  };

  const term = query.trim().toLowerCase();
  const rows = useMemo(
    () => (term ? current.filter((order) => matchesSearch(order, term)) : current),
    [current, term],
  );

  return (
    <>
      <PageHeader
        title="Orders"
        description={`Orders placed in ${summary}.`}
      />

      <DataTable
        caption="Orders"
        itemName="orders"
        columns={columns}
        data={rows}
        status={status}
        onRetry={reload}
        getRowId={(order) => order.id}
        initialSorting={[{ id: 'placedAt', desc: true }]}
        isSearching={Boolean(term)}
        onClearSearch={() => setQuery('')}
        emptyState={
          <StateMessage
            icon={ShoppingBag}
            title="No orders in this date range"
            description="Choose a longer range in the top bar to see more orders."
          />
        }
        renderToolbar={(table, { clearAll, hasFilters }) => (
          <TableToolbar
            searchLabel="Search orders"
            searchPlaceholder="Order number or customer"
            searchValue={query}
            onSearchChange={setQuery}
            hasFilters={hasFilters}
            onClear={clearAll}
          >
            <ColumnFilter
              column={table.getColumn('status')}
              label="Status"
              options={ORDER_STATUSES}
              allLabel="All statuses"
            />
            <ColumnFilter
              column={table.getColumn('payment')}
              label="Payment"
              options={PAYMENT_METHODS}
              allLabel="All methods"
            />
            <ColumnFilter column={table.getColumn('total')} label="Minimum total (£)" type="min" />
          </TableToolbar>
        )}
      />
    </>
  );
}
