import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { cx } from '../../../utils/cx';
import IconButton from '../IconButton/IconButton';
import styles from './Drawer.module.scss';

// A side panel built on the native <dialog>. showModal() gives us the focus trap,
// Escape to close, and an inert page behind, without any extra library.
export default function Drawer({
  open,
  onClose,
  title,
  side = 'right',
  variant = 'default',
  closeLabel = 'Close',
  children,
}) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Stop the page behind from scrolling while the drawer is open.
  useEffect(() => {
    if (!open) return undefined;
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = overflow;
    };
  }, [open]);

  // The panel fills the dialog, so a click that lands on the dialog itself is a backdrop click.
  const handleClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={cx(styles.drawer, side === 'left' && styles.left, variant === 'nav' && styles.nav)}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleClick}
    >
      {open && (
        <>
          <header className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <IconButton label={closeLabel} icon={X} onClick={onClose} />
          </header>
          <div className={styles.body}>{children}</div>
        </>
      )}
    </dialog>
  );
}
