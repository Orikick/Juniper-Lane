import { Eye, EyeOff } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useForm } from '../../../hooks/useForm';
import { PASSWORD_MIN_LENGTH, validateLogin } from '../../../utils/validators';
import Button from '../../ui/Button/Button';
import FormField from '../../ui/FormField/FormField';
import styles from './LoginForm.module.scss';

const INITIAL_VALUES = { email: '', password: '' };

// Mock sign-in form. Any well-formed email and a long enough password succeed.
export default function LoginForm({ onSignedIn }) {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const submit = useCallback(
    async (values) => {
      await signIn(values);
      onSignedIn();
    },
    [signIn, onSignedIn],
  );

  const form = useForm({ initialValues: INITIAL_VALUES, validate: validateLogin, onSubmit: submit });
  const { values, errors, status, submitError } = form;

  return (
    <form className={styles.form} onSubmit={form.handleSubmit} noValidate>
      <FormField id="login-email" label="Email address" error={errors.email}>
        {(field) => (
          <input
            {...field}
            name="email"
            type="email"
            autoComplete="username"
            placeholder="you@juniperlane.example"
            value={values.email}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            required
          />
        )}
      </FormField>

      <FormField
        id="login-password"
        label="Password"
        hint={`At least ${PASSWORD_MIN_LENGTH} characters.`}
        error={errors.password}
      >
        {(field) => (
          <div className={styles.passwordWrap}>
            <input
              {...field}
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={values.password}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
            />
            <button
              type="button"
              className={styles.reveal}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
        )}
      </FormField>

      {status === 'error' && (
        <p className={styles.error} role="alert">
          {submitError}
        </p>
      )}

      <Button type="submit" fullWidth loading={status === 'submitting'}>
        {status === 'submitting' ? 'Signing in' : 'Sign in'}
      </Button>
    </form>
  );
}
