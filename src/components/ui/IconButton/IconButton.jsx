import { forwardRef } from 'react';
import { cx } from '../../../utils/cx';
import styles from './IconButton.module.scss';

// A square button that shows only an icon. `label` is required: it is the accessible name.
const IconButton = forwardRef(function IconButton(
  { label, icon: Icon, className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cx(styles.button, className)}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon size={20} aria-hidden="true" />
    </button>
  );
});

export default IconButton;
