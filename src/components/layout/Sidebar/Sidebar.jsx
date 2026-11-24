import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../../data/navigation';
import { cx } from '../../../utils/cx';
import BrandMark from '../../ui/BrandMark/BrandMark';
import styles from './Sidebar.module.scss';

// The list of page links. Shared by the desktop sidebar and the mobile menu drawer.
// When collapsed, labels are hidden visually but stay available to screen readers.
export function SidebarNav({ collapsed = false, onNavigate }) {
  return (
    <nav aria-label="Main">
      <ul className={styles.list}>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cx(styles.link, isActive && styles.active, collapsed && styles.iconOnly)
              }
              title={collapsed ? label : undefined}
              onClick={onNavigate}
            >
              <Icon size={20} aria-hidden="true" />
              <span className={collapsed ? 'sr-only' : styles.label}>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Desktop and tablet sidebar. Below 768px it is hidden and AppShell shows a drawer instead.
export default function Sidebar({ collapsed, onToggle }) {
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside className={cx(styles.sidebar, collapsed && styles.collapsed)}>
      <div className={styles.brand}>
        <BrandMark />
        <span className={collapsed ? 'sr-only' : styles.brandName}>Juniper Lane</span>
      </div>

      <SidebarNav collapsed={collapsed} />

      <button
        type="button"
        className={cx(styles.toggle, collapsed && styles.iconOnly)}
        aria-expanded={!collapsed}
        title={collapsed ? 'Expand sidebar' : undefined}
        onClick={onToggle}
      >
        <ToggleIcon size={20} aria-hidden="true" />
        <span className={collapsed ? 'sr-only' : styles.label}>
          {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        </span>
      </button>
    </aside>
  );
}
