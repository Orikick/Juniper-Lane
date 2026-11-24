import { useEffect } from 'react';

// Calls `handler` when a pointer press lands outside the element. Used to close popovers.
export function useOnClickOutside(ref, handler, isActive = true) {
  useEffect(() => {
    if (!isActive) return undefined;

    const onPointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) handler(event);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [ref, handler, isActive]);
}
