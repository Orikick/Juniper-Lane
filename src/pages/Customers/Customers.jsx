import { Users } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCustomers } from '../../api/fakeApi';
import CustomerDrawer from '../../components/customers/CustomerDrawer/CustomerDrawer';
import ColumnFilter from '../../components/table/ColumnFilter/ColumnFilter';
import DataTable from '../../components/table/DataTable/DataTable';
import TableToolbar from '../../components/table/TableToolbar/TableToolbar';
import Avatar from '../../components/ui/Avatar/Avatar';
import PageHeader from '../../components/ui/PageHeader/PageHeader';
import StateMessage from '../../components/ui/StateMessage/StateMessage';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { formatCurrency, formatDate } from '../../utils/formatters';
import styles from './Customers.module.scss';

const matchesSearch = (customer, term) =>
  customer.name.toLowerCase().includes(term) || customer.email.toLowerCase().includes(term);

export default function Customers() {
  useDocumentTitle('Customers');
  const { status, data, reload } = useAsync(getCustomers);
  const customers = data ?? [];

  // Search and the open customer are both kept in the URL, so a customer can be linked to.
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const selectedId = searchParams.get('customer');

  const updateParam = (key, value, options = { replace: true }) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, options);
  };

  const term = query.trim().toLowerCase();
  const rows = useMemo(
    () => (term ? customers.filter((customer) => matchesSearch(customer, term)) : customers),
    [customers, term],
  );

  const countries = useMemo(
    () => [...new Set(customers.map((customer) => customer.country))].sort(),
    [customers],
  );

  const selected = customers.find((customer) => customer.id === selectedId) ?? null;

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Customer',
        cell: ({ row }) => (
          <div className={styles.person}>
            <Avatar name={row.original.name} size="sm" />
            <div className={styles.personText}>
              <button
                type="button"
                className={styles.nameButton}
                aria-haspopup="dialog"
                onClick={() => updateParam('customer', row.original.id, { replace: false })}
              >
                {row.original.name}
              </button>
              <span className={styles.email}>{row.original.email}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'country',
        header: 'Location',
        filterFn: 'equalsString',
        cell: ({ row }) => `${row.original.city}, ${row.original.country}`,
        meta: { hideBelow: 'md' },
      },
      {
        accessorKey: 'orderCount',
        header: 'Orders',
        sortDescFirst: true,
        meta: { align: 'right' },
      },
      {
        accessorKey: 'totalSpent',
        header: 'Total spent',
        sortDescFirst: true,
        cell: ({ getValue }) => formatCurrency(getValue()),
        meta: { align: 'right' },
      },
      {
        accessorKey: 'lastOrderAt',
        header: 'Last order',
        sortingFn: 'datetime',
        sortDescFirst: true,
        cell: ({ getValue }) => formatDate(getValue()),
        meta: { hideBelow: 'lg' },
      },
      {
        accessorKey: 'joinedAt',
        header: 'Customer since',
        sortingFn: 'datetime',
        cell: ({ getValue }) => formatDate(getValue()),
        meta: { hideBelow: 'lg' },
      },
    ],
    // updateParam changes with the URL; the cells only need the latest version when clicked.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams],
  );

  return (
    <>
      <PageHeader
        title="Customers"
        description="Everyone who has ordered from the shop, with all-time totals."
      />

      <DataTable
        caption="Customers"
        itemName="customers"
        columns={columns}
        data={rows}
        status={status}
        onRetry={reload}
        getRowId={(customer) => customer.id}
        initialSorting={[{ id: 'totalSpent', desc: true }]}
        isSearching={Boolean(term)}
        onClearSearch={() => updateParam('q', '')}
        emptyState={
          <StateMessage
            icon={Users}
            title="No customers yet"
            description="Customers appear here after they place their first order."
          />
        }
        renderToolbar={(table, { clearAll, hasFilters }) => (
          <TableToolbar
            searchLabel="Search customers"
            searchPlaceholder="Name or email"
            searchValue={query}
            onSearchChange={(value) => updateParam('q', value)}
            hasFilters={hasFilters}
            onClear={clearAll}
          >
            <ColumnFilter
              column={table.getColumn('country')}
              label="Country"
              options={countries}
              allLabel="All countries"
            />
          </TableToolbar>
        )}
      />

      <CustomerDrawer
        open={Boolean(selectedId)}
        onClose={() => updateParam('customer', null)}
        customer={selected}
        listStatus={status}
        onRetry={reload}
      />
    </>
  );
}
