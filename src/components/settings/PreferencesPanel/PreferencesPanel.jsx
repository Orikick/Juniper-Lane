import { Monitor, Moon, Sun } from 'lucide-react';
import { SIMULATE_ERRORS_KEY } from '../../../api/fakeApi';
import { useTheme } from '../../../context/ThemeContext';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { cx } from '../../../utils/cx';
import Card from '../../ui/Card/Card';
import Switch from '../../ui/Switch/Switch';
import styles from './PreferencesPanel.module.scss';

const THEME_OPTIONS = [
  { value: 'system', label: 'Match system', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

// Settings that apply straight away and are stored in this browser.
export default function PreferencesPanel() {
  const { preference, setPreference } = useTheme();
  const [simulateErrors, setSimulateErrors] = useLocalStorage(SIMULATE_ERRORS_KEY, false);

  return (
    <Card as="section" aria-labelledby="preferences-heading" className={styles.card}>
      <header>
        <h2 id="preferences-heading" className={styles.title}>
          Preferences
        </h2>
        <p className={styles.intro}>These apply straight away and are saved in this browser.</p>
      </header>

      <fieldset>
        <legend className={styles.legend}>Theme</legend>
        <div className={styles.themes}>
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <label key={value} className={cx(styles.theme, preference === value && styles.checked)}>
              <input
                type="radio"
                name="theme"
                value={value}
                checked={preference === value}
                onChange={() => setPreference(value)}
              />
              <Icon size={18} aria-hidden="true" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.section}>
        <h3 className={styles.legend}>Demo tools</h3>
        <Switch
          id="simulate-errors"
          label="Simulate failed requests"
          description="Makes data requests fail so you can see the error screens. It takes effect the next time a page loads data."
          checked={simulateErrors}
          onChange={setSimulateErrors}
        />
      </div>
    </Card>
  );
}
