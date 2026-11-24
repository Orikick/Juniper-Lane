import { CircleCheck } from 'lucide-react';
import { useCallback } from 'react';
import { saveProfile } from '../../../api/fakeApi';
import { useAuth } from '../../../context/AuthContext';
import { TIMEZONES } from '../../../data/orderOptions';
import { useForm } from '../../../hooks/useForm';
import { BIO_LIMIT, validateProfile } from '../../../utils/validators';
import Button from '../../ui/Button/Button';
import Card from '../../ui/Card/Card';
import FormField from '../../ui/FormField/FormField';
import Select from '../../ui/Select/Select';
import Switch from '../../ui/Switch/Switch';
import styles from './ProfileForm.module.scss';

const NOTIFICATIONS = [
  {
    key: 'weeklySummary',
    label: 'Weekly summary',
    description: 'An email every Monday with last week’s revenue and orders.',
  },
  {
    key: 'newOrders',
    label: 'New orders',
    description: 'An email for every order as soon as it is placed.',
  },
  {
    key: 'lowStock',
    label: 'Low stock',
    description: 'An email when a product has fewer than five left.',
  },
];

// Edits the signed-in person's profile. `profile` is the saved version, loaded by the page.
export default function ProfileForm({ profile }) {
  const { updateUser } = useAuth();

  const submit = useCallback(
    async (values) => {
      const cleaned = {
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        jobTitle: values.jobTitle.trim(),
        phone: values.phone.trim(),
      };
      const saved = await saveProfile(cleaned);
      updateUser(saved);
    },
    [updateUser],
  );

  const form = useForm({ initialValues: profile, validate: validateProfile, onSubmit: submit });
  const { values, errors, status, submitError, isDirty } = form;
  const fieldProps = (name) => ({
    name,
    value: values[name],
    onChange: form.handleChange,
    onBlur: form.handleBlur,
  });

  const setNotification = (key, checked) =>
    form.setValue('notifications', { ...values.notifications, [key]: checked });

  return (
    <Card as="section" aria-labelledby="profile-heading" className={styles.card}>
      <header className={styles.header}>
        <h2 id="profile-heading" className={styles.title}>
          Profile
        </h2>
        <p className={styles.intro}>
          Your name and job title appear in the top bar. We use your email for sign-in and
          notifications.
        </p>
      </header>

      <form className={styles.form} onSubmit={form.handleSubmit} noValidate>
        <div className={styles.grid}>
          <FormField id="profile-name" label="Full name" error={errors.name}>
            {(field) => (
              <input {...field} {...fieldProps('name')} type="text" autoComplete="name" required />
            )}
          </FormField>

          <FormField id="profile-email" label="Email address" error={errors.email}>
            {(field) => (
              <input
                {...field}
                {...fieldProps('email')}
                type="email"
                autoComplete="email"
                required
              />
            )}
          </FormField>

          <FormField id="profile-job" label="Job title" optional error={errors.jobTitle}>
            {(field) => (
              <input
                {...field}
                {...fieldProps('jobTitle')}
                type="text"
                autoComplete="organization-title"
              />
            )}
          </FormField>

          <FormField
            id="profile-phone"
            label="Phone number"
            optional
            hint="Include the country code, for example +44."
            error={errors.phone}
          >
            {(field) => (
              <input {...field} {...fieldProps('phone')} type="tel" autoComplete="tel" />
            )}
          </FormField>

          <FormField id="profile-timezone" label="Time zone" error={errors.timezone}>
            {(field) => (
              <Select
                {...field}
                {...fieldProps('timezone')}
                className={styles.select}
                options={TIMEZONES}
              />
            )}
          </FormField>

          <FormField
            id="profile-bio"
            label="About you"
            optional
            hint={`${values.bio.length} of ${BIO_LIMIT} characters`}
            error={errors.bio}
            className={styles.full}
          >
            {(field) => <textarea {...field} {...fieldProps('bio')} rows={3} />}
          </FormField>
        </div>

        <fieldset className={styles.notifications}>
          <legend className={styles.legend}>Email notifications</legend>
          {NOTIFICATIONS.map((item) => (
            <Switch
              key={item.key}
              id={`notify-${item.key}`}
              label={item.label}
              description={item.description}
              checked={values.notifications[item.key]}
              onChange={(checked) => setNotification(item.key, checked)}
            />
          ))}
        </fieldset>

        <div className={styles.footer}>
          <div className={styles.feedback} aria-live="polite">
            {status === 'success' && !isDirty && (
              <p className={styles.success}>
                <CircleCheck size={16} aria-hidden="true" />
                Changes saved.
              </p>
            )}
          </div>
          {status === 'error' && (
            <p className={styles.error} role="alert">
              Your changes were not saved. {submitError}
            </p>
          )}
          <div className={styles.actions}>
            <Button
              variant="secondary"
              disabled={!isDirty || status === 'submitting'}
              onClick={() => form.reset()}
            >
              Discard changes
            </Button>
            <Button type="submit" loading={status === 'submitting'} disabled={!isDirty}>
              {status === 'submitting' ? 'Saving changes' : 'Save changes'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
