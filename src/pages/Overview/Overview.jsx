import { useMemo } from 'react';
import CategoryDonutChart from '../../components/charts/CategoryDonutChart/CategoryDonutChart';
import ChartCard from '../../components/charts/ChartCard/ChartCard';
import ChartDataTable from '../../components/charts/ChartDataTable/ChartDataTable';
import OrdersBarChart from '../../components/charts/OrdersBarChart/OrdersBarChart';
import RevenueLineChart from '../../components/charts/RevenueLineChart/RevenueLineChart';
import KpiGrid from '../../components/dashboard/KpiGrid/KpiGrid';
import Card from '../../components/ui/Card/Card';
import PageHeader from '../../components/ui/PageHeader/PageHeader';
import StateMessage from '../../components/ui/StateMessage/StateMessage';
import { useDateRange } from '../../context/DateRangeContext';
import categories from '../../data/categories.json';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useOrdersInRange } from '../../hooks/useOrdersInRange';
import { describeRange } from '../../utils/dateRange';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';
import {
  buildCategoryBreakdown,
  buildKpis,
  buildTimeSeries,
  getGranularity,
  summarise,
} from '../../utils/metrics';
import styles from './Overview.module.scss';

const GRANULARITY_LABELS = { day: 'day', week: 'week', month: 'month' };

const REVENUE_COLUMNS = [
  { key: 'longLabel', label: 'Period' },
  { key: 'revenue', label: 'This period', align: 'right', format: (value) => formatCurrency(value) },
  {
    key: 'previousRevenue',
    label: 'Previous period',
    align: 'right',
    format: (value) => (value === null ? 'No data' : formatCurrency(value)),
  },
];

const ORDER_COLUMNS = [
  { key: 'longLabel', label: 'Period' },
  { key: 'orders', label: 'Orders', align: 'right', format: (value) => formatNumber(value) },
];

const CATEGORY_COLUMNS = [
  { key: 'name', label: 'Category' },
  { key: 'value', label: 'Revenue', align: 'right', format: (value) => formatCurrency(value) },
  { key: 'share', label: 'Share', align: 'right', format: (value) => formatPercent(value) },
];

export default function Overview() {
  useDocumentTitle('Overview');
  const { range, previousRange, summary, comparisonLabel } = useDateRange();
  const { status, reload, all, current, previous } = useOrdersInRange();
  const isReady = status === 'success';

  // Everything on this page is derived from the same orders, so the figures always agree.
  const view = useMemo(() => {
    if (!isReady) return null;
    const totals = summarise(current);
    return {
      totals,
      kpis: buildKpis({ all, current, previous, range, previousRange }),
      series: buildTimeSeries({ current, previous, range, previousRange }),
      categories: buildCategoryBreakdown(current, categories),
      granularity: GRANULARITY_LABELS[getGranularity(range)],
    };
  }, [isReady, all, current, previous, range, previousRange]);

  const chartStatus = !isReady ? 'loading' : current.length === 0 ? 'empty' : 'ready';
  const rangeText = describeRange(range);

  return (
    <>
      <PageHeader
        title="Overview"
        description={`${summary}, compared with the ${comparisonLabel}.`}
      />

      {status === 'error' ? (
        <Card>
          <StateMessage
            tone="error"
            title="Sales figures could not be loaded"
            description="The request failed. Check your connection and try again."
            actionLabel="Try again"
            onAction={reload}
          />
        </Card>
      ) : (
        <div className={styles.layout}>
          <KpiGrid kpis={view?.kpis ?? []} comparisonLabel={comparisonLabel} loading={!isReady} />

          <ChartCard
            className={styles.wide}
            title="Revenue"
            description={view ? `By ${view.granularity}, excluding refunds and cancellations` : undefined}
            status={chartStatus}
            height={280}
            legend={[
              { label: 'This period', color: 'var(--chart-1)' },
              { label: `Previous period (${comparisonLabel})`, color: 'var(--text-3)', dashed: true },
            ]}
            table={
              view && (
                <ChartDataTable
                  caption={`Revenue by ${view.granularity}`}
                  columns={REVENUE_COLUMNS}
                  rows={view.series}
                  maxHeight={280}
                />
              )
            }
          >
            {view && (
              <RevenueLineChart
                data={view.series}
                summary={`Line chart of revenue by ${view.granularity} for ${rangeText}. Total ${formatCurrency(view.totals.revenue)}.`}
              />
            )}
          </ChartCard>

          <ChartCard
            title="Orders"
            description={view ? `Orders placed per ${view.granularity}` : undefined}
            status={chartStatus}
            height={260}
            table={
              view && (
                <ChartDataTable
                  caption={`Orders by ${view.granularity}`}
                  columns={ORDER_COLUMNS}
                  rows={view.series}
                  maxHeight={260}
                />
              )
            }
          >
            {view && (
              <OrdersBarChart
                data={view.series}
                summary={`Bar chart of orders by ${view.granularity} for ${rangeText}. ${formatNumber(view.totals.orders)} orders in total.`}
              />
            )}
          </ChartCard>

          <ChartCard
            title="Sales by category"
            description="Share of revenue in this period"
            status={chartStatus}
            height={260}
            table={
              view && (
                <ChartDataTable
                  caption="Revenue by category"
                  columns={CATEGORY_COLUMNS}
                  rows={view.categories}
                  maxHeight={260}
                />
              )
            }
          >
            {view && (
              <CategoryDonutChart
                data={view.categories}
                total={view.totals.revenue}
                summary={`Donut chart of revenue by category. ${view.categories
                  .map((slice) => `${slice.name} ${formatPercent(slice.share)}`)
                  .join(', ')}.`}
              />
            )}
          </ChartCard>
        </div>
      )}
    </>
  );
}
