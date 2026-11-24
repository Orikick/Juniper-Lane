import { Calendar, Check, ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useDateRange } from '../../../context/DateRangeContext';
import { DATE_PRESETS } from '../../../data/dateRanges';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import { cx } from '../../../utils/cx';
import { fromInputDate, toInputDate } from '../../../utils/formatters';
import { validateCustomRange } from '../../../utils/validators';
import Button from '../../ui/Button/Button';
import styles from './DateRangePicker.module.scss';

// Top-bar control for the reporting period: four quick ranges plus a custom from/to range.
export default function DateRangePicker() {
  const { presetId, range, label, today, setPreset, setCustomRange } = useDateRange();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ from: '', to: '' });
  const [error, setError] = useState(null);

  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const panelId = useId();
  const fromId = useId();
  const toId = useId();
  const errorId = useId();

  const close = useCallback(() => setOpen(false), []);
  useOnClickOutside(wrapRef, close, open);

  // Move focus into the panel when it opens, starting on the selected range.
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    (panel.querySelector('[aria-pressed="true"]') ?? panel.querySelector('button'))?.focus();
  }, [open]);

  const closeAndReturnFocus = () => {
    close();
    buttonRef.current?.focus();
  };

  const toggle = () => {
    if (!open) {
      setDraft({ from: toInputDate(range.from), to: toInputDate(range.to) });
      setError(null);
    }
    setOpen((isOpen) => !isOpen);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && open) closeAndReturnFocus();
  };

  const choosePreset = (id) => {
    setPreset(id);
    closeAndReturnFocus();
  };

  const applyCustomRange = (event) => {
    event.preventDefault();
    const from = fromInputDate(draft.from);
    const to = fromInputDate(draft.to);
    const problem = validateCustomRange(from, to, today);
    if (problem) {
      setError(problem);
      return;
    }
    setCustomRange(from, to);
    closeAndReturnFocus();
  };

  const updateDraft = (event) => {
    setDraft((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    setError(null);
  };

  return (
    <div className={styles.wrap} ref={wrapRef} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        aria-label={`Date range: ${label}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={toggle}
      >
        <Calendar size={18} aria-hidden="true" />
        <span className={styles.triggerLabel}>{label}</span>
        <ChevronDown className={styles.chevron} size={16} aria-hidden="true" />
      </button>

      {open && (
        <div
          id={panelId}
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-label="Choose a date range"
        >
          <ul className={styles.presets}>
            {DATE_PRESETS.map((preset) => {
              const isSelected = preset.id === presetId;
              return (
                <li key={preset.id}>
                  <button
                    type="button"
                    className={cx(styles.preset, isSelected && styles.selected)}
                    aria-pressed={isSelected}
                    onClick={() => choosePreset(preset.id)}
                  >
                    {preset.label}
                    {isSelected && <Check size={16} aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>

          <form className={styles.custom} onSubmit={applyCustomRange} noValidate>
            <fieldset aria-describedby={error ? errorId : undefined}>
              <legend className={styles.legend}>Custom range</legend>
              <div className={styles.dates}>
                <div className={styles.dateField}>
                  <label htmlFor={fromId}>From</label>
                  <input
                    id={fromId}
                    name="from"
                    type="date"
                    value={draft.from}
                    max={toInputDate(today)}
                    aria-invalid={error ? true : undefined}
                    onChange={updateDraft}
                  />
                </div>
                <div className={styles.dateField}>
                  <label htmlFor={toId}>To</label>
                  <input
                    id={toId}
                    name="to"
                    type="date"
                    value={draft.to}
                    max={toInputDate(today)}
                    aria-invalid={error ? true : undefined}
                    onChange={updateDraft}
                  />
                </div>
              </div>
            </fieldset>
            {error && (
              <p id={errorId} className={styles.error} role="alert">
                {error}
              </p>
            )}
            <Button type="submit" size="sm" fullWidth>
              Apply range
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
