import { useCallback } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import Footer from '../../components/layout/Footer/Footer';
import ThemeToggle from '../../components/layout/ThemeToggle/ThemeToggle';
import BrandMark from '../../components/ui/BrandMark/BrandMark';
import { useAuth } from '../../context/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import styles from './Login.module.scss';

export default function Login() {
  useDocumentTitle('Sign in');
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from ?? '/';

  const goToDestination = useCallback(
    () => navigate(destination, { replace: true }),
    [navigate, destination],
  );

  if (user) return <Navigate to={destination} replace />;

  return (
    <div className={styles.page}>
      <aside className={styles.brand}>
        <div className={styles.logo}>
          <BrandMark size={36} />
          <span>Juniper Lane</span>
        </div>
        <p className={styles.statement}>
          Every order, customer and pound of revenue from the shop, in one place.
        </p>
        <p className={styles.footnote}>
          Juniper Lane sells homeware and small gifts from a studio in Bristol.
        </p>
      </aside>

      <div className={styles.content}>
        <div className={styles.toggle}>
          <ThemeToggle />
        </div>
        <main className={styles.main}>
          <div className={styles.panel}>
            <h1 className={styles.title}>Sign in to the shop admin</h1>
            <p className={styles.demo}>
              This is a demo with no real accounts. Use any email address and a password of 8 or
              more characters.
            </p>
            <LoginForm onSignedIn={goToDestination} />
          </div>
        </main>
        <Footer className={styles.footer} />
      </div>
    </div>
  );
}
