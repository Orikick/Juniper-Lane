import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const THEME_KEY = 'jl:theme';

const ThemeContext = createContext(null);

// `preference` is 'system', 'light' or 'dark'. `theme` is what is actually shown.
// index.html applies the same logic before React loads, to avoid a flash.
export function ThemeProvider({ children }) {
  const [preference, setPreference] = useLocalStorage(THEME_KEY, 'system');
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = preference === 'system' ? (systemPrefersDark ? 'dark' : 'light') : preference;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(
    () => setPreference(theme === 'dark' ? 'light' : 'dark'),
    [setPreference, theme],
  );

  const value = useMemo(
    () => ({ theme, preference, setPreference, toggleTheme }),
    [theme, preference, setPreference, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
