import { Menu } from 'lucide-react';
import IconButton from '../../ui/IconButton/IconButton';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import GlobalSearch from '../GlobalSearch/GlobalSearch';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import UserMenu from '../UserMenu/UserMenu';
import styles from './TopBar.module.scss';

export default function TopBar({ onOpenMenu }) {
  return (
    <header className={styles.bar}>
      <IconButton
        className={styles.menuButton}
        label="Open menu"
        icon={Menu}
        aria-haspopup="dialog"
        onClick={onOpenMenu}
      />
      <GlobalSearch />
      <div className={styles.actions}>
        <DateRangePicker />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
