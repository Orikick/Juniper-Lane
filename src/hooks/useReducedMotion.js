import { useMediaQuery } from './useMediaQuery';

// True when the person has asked their system to minimise animation.
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
