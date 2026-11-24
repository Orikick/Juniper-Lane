import { cx } from '../../../utils/cx';
import styles from './Footer.module.scss';

// Page footer with the developer credit. Shown under every page, including sign-in.
export default function Footer({ className }) {
  return (
    <footer className={cx(styles.footer, className)}>
      <p>
        Developed by <span className={styles.name}>Orest Labiak</span>
      </p>
    </footer>
  );
}
