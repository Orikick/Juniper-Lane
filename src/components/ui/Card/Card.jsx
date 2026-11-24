import { cx } from '../../../utils/cx';
import styles from './Card.module.scss';

export default function Card({ as: Component = 'div', padded = true, className, children, ...rest }) {
  return (
    <Component className={cx(styles.card, padded && styles.padded, className)} {...rest}>
      {children}
    </Component>
  );
}
