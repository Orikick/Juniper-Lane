import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { cx } from '../../../utils/cx';
import Drawer from '../../ui/Drawer/Drawer';
import Footer from '../Footer/Footer';
import Spinner from '../../ui/Spinner/Spinner';
import Sidebar, { SidebarNav } from '../Sidebar/Sidebar';
import SkipLink from '../SkipLink/SkipLink';
import TopBar from '../TopBar/TopBar';
import styles from './AppShell.module.scss';

// The signed-in layout: sidebar, top bar and the current page.
export default function AppShell() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const isFirstRender = useRef(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // The sidebar starts collapsed on narrower screens. Once someone uses the toggle,
  // their choice is remembered instead.
  const isWide = useMediaQuery('(min-width: 1100px)');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [savedCollapsed, setSavedCollapsed] = useLocalStorage('jl:sidebar-collapsed', null);
  const collapsed = savedCollapsed ?? !isWide;

  // On navigation: close the mobile menu, scroll to the top and move focus to the
  // page content so keyboard and screen-reader users land on the new page.
  useEffect(() => {
    setMenuOpen(false);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  useEffect(() => {
    if (isDesktop) setMenuOpen(false);
  }, [isDesktop]);

  return (
    <div className={cx(styles.shell, collapsed && styles.collapsed)}>
      <SkipLink />
      <Sidebar collapsed={collapsed} onToggle={() => setSavedCollapsed(!collapsed)} />

      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Juniper Lane"
        side="left"
        variant="nav"
        closeLabel="Close menu"
      >
        <div className={styles.drawerNav}>
          <SidebarNav onNavigate={() => setMenuOpen(false)} />
        </div>
      </Drawer>

      <div className={styles.main}>
        <TopBar onOpenMenu={() => setMenuOpen(true)} />
        <main id="main-content" ref={mainRef} tabIndex={-1} className={styles.content}>
          <Suspense
            fallback={
              <div className={styles.fallback}>
                <Spinner label="Loading page" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}
