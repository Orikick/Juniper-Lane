import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import styles from './DropdownMenu.module.scss';

// A button that opens a menu of actions. Follows the ARIA menu button pattern:
// arrow keys move between items, Escape closes and returns focus to the button.
//
// `renderTrigger` receives the props to spread on the button.
// `items` is a list of { id, label, icon, onSelect }.
export default function DropdownMenu({ label, renderTrigger, header, items }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);
  useOnClickOutside(wrapRef, close, open);

  useEffect(() => {
    if (open) menuRef.current?.querySelector('[role="menuitem"]')?.focus();
  }, [open]);

  const handleMenuKeyDown = (event) => {
    const menuItems = [...menuRef.current.querySelectorAll('[role="menuitem"]')];
    const index = menuItems.indexOf(document.activeElement);
    const focusItem = (nextIndex) => {
      event.preventDefault();
      menuItems[(nextIndex + menuItems.length) % menuItems.length].focus();
    };

    if (event.key === 'ArrowDown') focusItem(index + 1);
    else if (event.key === 'ArrowUp') focusItem(index - 1);
    else if (event.key === 'Home') focusItem(0);
    else if (event.key === 'End') focusItem(menuItems.length - 1);
    else if (event.key === 'Tab') close();
    else if (event.key === 'Escape') {
      close();
      triggerRef.current?.focus();
    }
  };

  const triggerProps = {
    ref: triggerRef,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    onClick: () => setOpen((isOpen) => !isOpen),
    onKeyDown: (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setOpen(true);
      }
    },
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      {renderTrigger(triggerProps)}
      {open && (
        <div className={styles.panel}>
          {header && <div className={styles.header}>{header}</div>}
          <div
            id={menuId}
            ref={menuRef}
            role="menu"
            aria-label={label}
            className={styles.menu}
            onKeyDown={handleMenuKeyDown}
          >
            {items.map(({ id, label: itemLabel, icon: Icon, onSelect }) => (
              <button
                key={id}
                type="button"
                role="menuitem"
                tabIndex={-1}
                className={styles.item}
                onClick={() => {
                  close();
                  onSelect();
                }}
              >
                {Icon && <Icon size={16} aria-hidden="true" />}
                {itemLabel}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
