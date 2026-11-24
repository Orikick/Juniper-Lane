import { TriangleAlert } from 'lucide-react';
import { cx } from '../../../utils/cx';
import styles from './FormField.module.scss';

// Wires a label, hint and error message to one control.
// `children` is a function that receives the props to spread on the control:
//
//   <FormField id="email" label="Email" error={errors.email}>
//     {(field) => <input type="email" {...field} />}
//   </FormField>
export default function FormField({ id, label, hint, error, optional = false, className, children }) {
  const hintId = hint ? `${id}-hint` : null;
  const errorId = error ? `${id}-error` : null;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx(styles.field, className)}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {optional && <span className={styles.optional}> (optional)</span>}
      </label>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {children({
        id,
        className: styles.control,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })}
      {error && (
        <p id={errorId} className={styles.error}>
          <TriangleAlert size={14} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
