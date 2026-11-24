import { useCallback, useEffect, useState } from 'react';

// Runs an async function and tracks its status: 'loading', 'success' or 'error'.
// `reload` runs it again, which is what the "Try again" buttons call.
export function useAsync(asyncFunction, dependencies = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    setState({ status: 'loading', data: null, error: null });

    asyncFunction().then(
      (data) => {
        if (isCurrent) setState({ status: 'success', data, error: null });
      },
      (error) => {
        if (isCurrent) setState({ status: 'error', data: null, error });
      },
    );

    // Ignore the result if the component unmounts or the request is superseded.
    return () => {
      isCurrent = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, attempt]);

  const reload = useCallback(() => setAttempt((count) => count + 1), []);

  return { ...state, reload };
}
