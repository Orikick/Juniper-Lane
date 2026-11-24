import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';
import { cx } from '../../../utils/cx';
import styles from './Select.module.scss';

// A native <select> with consistent styling. `options` is a list of { value, label }.
const Select = forwardRef(function Select({ options, size = 'md', className, ...rest }, ref) {
  return (
    <span className={cx(styles.wrap, className)}>
      <select ref={ref} className={cx(styles.select, styles[size])} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className={styles.chevron} size={16} aria-hidden="true" />
    </span>
  );
});

export default Select;
