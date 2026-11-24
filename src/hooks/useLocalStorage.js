import { useCallback, useState } from 'react';

function read(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? fallback : JSON.parse(stored);
  } catch {
    return fallback;
  }
}

// useState that also saves to localStorage. Falls back to memory when storage is unavailable.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => read(key, initialValue));

  const update = useCallback(
    (next) => {
      setValue((previous) => {
        const resolved = typeof next === 'function' ? next(previous) : next;
        try {
          if (resolved === null || resolved === undefined) {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, JSON.stringify(resolved));
          }
        } catch {
          // Ignore write failures, for example in private browsing.
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update];
}
