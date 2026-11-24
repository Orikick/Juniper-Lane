import { Search } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { search } from '../../../api/fakeApi';
import { useDateRange } from '../../../context/DateRangeContext';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import { cx } from '../../../utils/cx';
import { formatCurrency } from '../../../utils/formatters';
import styles from './GlobalSearch.module.scss';

const MIN_QUERY_LENGTH = 2;

// Search box in the top bar. Suggests matching orders and customers as you type,
// following the ARIA combobox pattern: arrow keys move through the suggestions,
// Enter opens one, Escape closes the list.
export default function GlobalSearch() {
  const navigate = useNavigate();
  const { includeDate } = useDateRange();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [state, setState] = useState({ status: 'idle', results: null });
  const debouncedQuery = useDebouncedValue(query.trim(), 250);

  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const inputId = useId();
  const listId = useId();

  const close = useCallback(() => setIsOpen(false), []);
  useOnClickOutside(wrapRef, close, isOpen);

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setState({ status: 'idle', results: null });
      return undefined;
    }

    let isCurrent = true;
    setState((previous) => ({ ...previous, status: 'loading' }));
    search(debouncedQuery).then(
      (results) => {
        if (isCurrent) setState({ status: 'success', results });
      },
      () => {
        if (isCurrent) setState({ status: 'error', results: null });
      },
    );
    return () => {
      isCurrent = false;
    };
  }, [debouncedQuery]);

  const groups = useMemo(() => {
    if (!state.results) return [];
    return [
      {
        id: 'orders',
        label: 'Orders',
        options: state.results.orders.map((order) => ({
          id: `order-${order.id}`,
          title: order.id,
          detail: `${order.customerName}, ${formatCurrency(order.total, { precise: true })}`,
          to: `/orders?q=${encodeURIComponent(order.id)}`,
          placedAt: order.placedAt,
        })),
      },
      {
        id: 'customers',
        label: 'Customers',
        options: state.results.customers.map((customer) => ({
          id: `customer-${customer.id}`,
          title: customer.name,
          detail: customer.email,
          to: `/customers?customer=${encodeURIComponent(customer.id)}`,
        })),
      },
    ].filter((group) => group.options.length > 0);
  }, [state.results]);

  const options = useMemo(() => groups.flatMap((group) => group.options), [groups]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [options]);

  const goTo = (to) => {
    navigate(to);
    setQuery('');
    setIsOpen(false);
  };

  const chooseOption = (option) => {
    // The orders table follows the date range, so make sure the order is inside it.
    if (option.placedAt) includeDate(option.placedAt);
    goTo(option.to);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const term = query.trim();
    if (activeIndex >= 0 && options[activeIndex]) chooseOption(options[activeIndex]);
    else if (term) goTo(`/orders?q=${encodeURIComponent(term)}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
      if (options.length === 0) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((index) => {
        if (index === -1) return step === 1 ? 0 : options.length - 1;
        return (index + step + options.length) % options.length;
      });
    } else if (event.key === 'Escape') {
      if (isOpen) close();
      else setQuery('');
    }
  };

  const hasQuery = query.trim().length >= MIN_QUERY_LENGTH;
  const showPanel = isOpen && hasQuery && state.status !== 'idle';
  const showOptions = showPanel && options.length > 0;
  const optionDomId = (option) => `${listId}-${option.id}`;

  return (
    <form className={styles.search} role="search" ref={wrapRef} onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={inputId}>
        Search orders and customers
      </label>
      <Search className={styles.icon} size={18} aria-hidden="true" />
      <input
        ref={inputRef}
        id={inputId}
        className={styles.input}
        type="search"
        placeholder="Search orders and customers"
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showOptions}
        aria-controls={listId}
        aria-activedescendant={
          showOptions && activeIndex >= 0 ? optionDomId(options[activeIndex]) : undefined
        }
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />

      <div className={cx(styles.panel, !showPanel && styles.hidden)}>
        {showPanel && state.status === 'loading' && options.length === 0 && (
          <p className={styles.message} role="status">
            Searching
          </p>
        )}
        {showPanel && state.status === 'error' && (
          <p className={styles.message} role="alert">
            Search is unavailable right now. Try again in a moment.
          </p>
        )}
        {showPanel && state.status === 'success' && options.length === 0 && (
          <p className={styles.message} role="status">
            No orders or customers match “{debouncedQuery}”.
          </p>
        )}

        <div id={listId} role="listbox" aria-label="Search suggestions">
          {showOptions &&
            groups.map((group) => (
              <div key={group.id} role="group" aria-labelledby={`${listId}-${group.id}`}>
                <p id={`${listId}-${group.id}`} className={styles.groupLabel}>
                  {group.label}
                </p>
                {group.options.map((option) => {
                  const isActive = options[activeIndex] === option;
                  return (
                    <div
                      key={option.id}
                      id={optionDomId(option)}
                      role="option"
                      aria-selected={isActive}
                      className={cx(styles.option, isActive && styles.active)}
                      // Keep focus in the input so a click does not close the list first.
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => chooseOption(option)}
                    >
                      <span className={styles.optionTitle}>{option.title}</span>
                      <span className={styles.optionDetail}>{option.detail}</span>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>
    </form>
  );
}
