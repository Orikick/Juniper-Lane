import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Avatar from '../../ui/Avatar/Avatar';
import DropdownMenu from '../../ui/DropdownMenu/DropdownMenu';
import styles from './UserMenu.module.scss';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const items = [
    { id: 'settings', label: 'Settings', icon: Settings, onSelect: () => navigate('/settings') },
    // ProtectedRoute redirects to the login screen once the user is cleared.
    { id: 'sign-out', label: 'Sign out', icon: LogOut, onSelect: signOut },
  ];

  return (
    <DropdownMenu
      label="Account"
      items={items}
      header={
        <>
          <p className={styles.menuName}>{user.name}</p>
          <p className={styles.menuEmail}>{user.email}</p>
        </>
      }
      renderTrigger={(triggerProps) => (
        <button
          type="button"
          className={styles.trigger}
          aria-label={`Account menu for ${user.name}`}
          {...triggerProps}
        >
          <Avatar name={user.name} />
          <span className={styles.identity}>
            <span className={styles.name}>{user.name}</span>
            <span className={styles.role}>{user.jobTitle}</span>
          </span>
          <ChevronDown className={styles.chevron} size={16} aria-hidden="true" />
        </button>
      )}
    />
  );
}
