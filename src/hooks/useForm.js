import { useCallback, useMemo, useRef, useState } from 'react';

// Small form helper: values, validation on blur and submit, and submit status.
// `validate` takes the values and returns an object of messages keyed by field name.
// `status` is 'idle', 'submitting', 'success' or 'error'.
export function useForm({ initialValues, validate, onSubmit }) {
  const baseline = useRef(initialValues);
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');
  const [submitError, setSubmitError] = useState(null);

  const allErrors = useMemo(() => validate(values), [validate, values]);

  // Only show a field's error once the person has left it or tried to submit.
  const errors = useMemo(() => {
    const visible = {};
    for (const [name, message] of Object.entries(allErrors)) {
      if (touched[name]) visible[name] = message;
    }
    return visible;
  }, [allErrors, touched]);

  const setValue = useCallback((name, value) => {
    setValues((previous) => ({ ...previous, [name]: value }));
    setStatus((current) => (current === 'submitting' ? current : 'idle'));
  }, []);

  const handleChange = useCallback(
    (event) => {
      const { name, type, value, checked } = event.target;
      setValue(name, type === 'checkbox' ? checked : value);
    },
    [setValue],
  );

  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    if (name) setTouched((previous) => ({ ...previous, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const invalidNames = Object.keys(allErrors);

      if (invalidNames.length > 0) {
        setTouched((previous) => ({
          ...previous,
          ...Object.fromEntries(invalidNames.map((name) => [name, true])),
        }));
        // Send keyboard and screen-reader users straight to the first problem.
        form.elements.namedItem(invalidNames[0])?.focus();
        return;
      }

      setStatus('submitting');
      setSubmitError(null);
      try {
        await onSubmit(values);
        baseline.current = values;
        setStatus('success');
      } catch (error) {
        setSubmitError(error?.message ?? 'Something went wrong. Try again.');
        setStatus('error');
      }
    },
    [allErrors, onSubmit, values],
  );

  const reset = useCallback((nextValues) => {
    if (nextValues) baseline.current = nextValues;
    setValues(baseline.current);
    setTouched({});
    setStatus('idle');
    setSubmitError(null);
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(baseline.current),
    // `status` is listed because a successful save moves the baseline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values, status],
  );

  return {
    values,
    errors,
    status,
    submitError,
    isDirty,
    setValue,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}
