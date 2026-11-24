import { Mail, MapPin, Phone, UserX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCustomerOrders } from '../../../api/fakeApi';
import { useDateRange } from '../../../context/DateRangeContext';
import { useAsync } from '../../../hooks/useAsync';
import { formatCurrency, formatDate, formatNumber } from '../../../utils/formatters';
import Avatar from '../../ui/Avatar/Avatar';
import Drawer from '../../ui/Drawer/Drawer';
import Skeleton from '../../ui/Skeleton/Skeleton';
import Spinner from '../../ui/Spinner/Spinner';
import StateMessage from '../../ui/StateMessage/StateMessage';
import StatusBadge from '../../ui/StatusBadge/StatusBadge';
import styles from './CustomerDrawer.module.scss';

const RECENT_ORDER_LIMIT = 8;

// Side panel with one customer's contact details, lifetime figures and order history.
// `listStatus` is the status of the customer list, which may still be loading
// when the drawer is opened from a link.
export default function CustomerDrawer({ open, onClose, customer, listStatus, onRetry }) {
  let content;

  if (listStatus === 'loading') {
    content = (
      <div className={styles.centred}>
        <Spinner label="Loading customer" />
      </div>
    );
  } else if (listStatus === 'error') {
    content = (
      <StateMessage
        tone="error"
        title="This customer could not be loaded"
        description="The request failed. Check your connection and try again."
        actionLabel="Try again"
        onAction={onRetry}
      />
    );
  } else if (!customer) {
    content = (
      <StateMessage
        icon={UserX}
        title="Customer not found"
        description="This customer may have been removed, or the link is out of date."
      />
    );
  } else {
    content = <CustomerDetails customer={customer} />;
  }

  return (
    <Drawer open={open} onClose={onClose} title={customer ? customer.name : 'Customer'} closeLabel="Close customer details">
      {content}
    </Drawer>
  );
}

function CustomerDetails({ customer }) {
  const averageOrder = customer.orderCount > 0 ? customer.totalSpent / customer.orderCount : 0;

  return (
    <div className={styles.details}>
      <section className={styles.profile} aria-label="Contact details">
        <Avatar name={customer.name} size="lg" />
        <ul className={styles.contact}>
          <li>
            <Mail size={16} aria-hidden="true" />
            <a href={`mailto:${customer.email}`}>{customer.email}</a>
          </li>
          {customer.phone && (
            <li>
              <Phone size={16} aria-hidden="true" />
              <a href={`tel:${customer.phone.replace(/\s/g, '')}`}>{customer.phone}</a>
            </li>
          )}
          <li>
            <MapPin size={16} aria-hidden="true" />
            <span>
              {customer.city}, {customer.country}
            </span>
          </li>
        </ul>
      </section>

      <section aria-labelledby="customer-figures">
        <h3 id="customer-figures" className={styles.heading}>
          Lifetime figures
        </h3>
        <dl className={styles.stats}>
          <div>
            <dt>Orders</dt>
            <dd>{formatNumber(customer.orderCount)}</dd>
          </div>
          <div>
            <dt>Total spent</dt>
            <dd>{formatCurrency(customer.totalSpent)}</dd>
          </div>
          <div>
            <dt>Average order</dt>
            <dd>{formatCurrency(averageOrder, { precise: true })}</dd>
          </div>
          <div>
            <dt>Customer since</dt>
            <dd>{formatDate(customer.joinedAt)}</dd>
          </div>
        </dl>
      </section>

      <CustomerOrders customer={customer} />
    </div>
  );
}

function CustomerOrders({ customer }) {
  const { includeDate } = useDateRange();
  const { status, data, reload } = useAsync(() => getCustomerOrders(customer.id), [customer.id]);
  const oldest = data && data.length > 0 ? data[data.length - 1].placedAt : null;

  return (
    <section aria-labelledby="customer-orders">
      <h3 id="customer-orders" className={styles.heading}>
        Recent orders
      </h3>

      {status === 'loading' && (
        <div role="status">
          <span className="sr-only">Loading orders</span>
          <ul className={styles.orders} aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => (
              <li key={index} className={styles.order}>
                <Skeleton width="70%" height={14} />
                <Skeleton width={56} height={14} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === 'error' && (
        <StateMessage
          compact
          tone="error"
          title="Orders could not be loaded"
          actionLabel="Try again"
          onAction={reload}
        />
      )}

      {status === 'success' && data.length === 0 && (
        <StateMessage compact title="No orders yet" description="Orders this customer places will show here." />
      )}

      {status === 'success' && data.length > 0 && (
        <>
          <ul className={styles.orders}>
            {data.slice(0, RECENT_ORDER_LIMIT).map((order) => (
              <li key={order.id} className={styles.order}>
                <div className={styles.orderMain}>
                  <span className={styles.orderId}>{order.id}</span>
                  <span className={styles.orderMeta}>
                    {formatDate(order.placedAt)}, {order.itemCount}{' '}
                    {order.itemCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <StatusBadge status={order.status} />
                <span className={styles.orderTotal}>{formatCurrency(order.total)}</span>
              </li>
            ))}
          </ul>
          <Link
            className={styles.allOrders}
            to={`/orders?q=${encodeURIComponent(customer.name)}`}
            onClick={() => includeDate(oldest)}
          >
            View all {formatNumber(data.length)} orders from {customer.name}
          </Link>
        </>
      )}
    </section>
  );
}
