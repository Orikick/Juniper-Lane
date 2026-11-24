import { LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import styles from './NotFound.module.scss';

export default function NotFound() {
  useDocumentTitle('Page not found');
  const { pathname } = useLocation();

  return (
    <section className={styles.page}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>
        There is no page at <code>{pathname}</code>. Check the address, or go back to the
        overview.
      </p>
      <Button as={Link} to="/" icon={LayoutDashboard}>
        Go to overview
      </Button>
    </section>
  );
}
