import { forwardRef } from 'react';
import { cx } from '../../../utils/cx';
import Spinner from '../Spinner/Spinner';
import styles from './Button.module.scss';

// Renders a <button> by default. Pass `as={Link}` to get the same look on a link.
const Button = forwardRef(function Button(
  {
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    icon: Icon,
    loading = false,
    fullWidth = false,
    disabled = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const buttonProps = Component === 'button' ? { type: 'button', disabled: disabled || loading } : {};

  return (
    <Component
      ref={ref}
      className={cx(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className,
      )}
      aria-busy={loading || undefined}
      {...buttonProps}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {!loading && Icon && <Icon size={16} aria-hidden="true" />}
      <span>{children}</span>
    </Component>
  );
});

export default Button;
