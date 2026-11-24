import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import IconButton from '../../ui/IconButton/IconButton';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <IconButton
      label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      icon={isDark ? Sun : Moon}
      onClick={toggleTheme}
    />
  );
}
