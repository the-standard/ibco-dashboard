import useBreakpoint from 'use-breakpoint';

/**
 * It is important to bind the object of breakpoints to a variable for memoization to work correctly.
 * If they are created dynamically, try using the `useMemo` hook.
 */
const BREAKPOINTS = { mobile: 0, desktop: 768 }

export const CurrentBreakpoint = () => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'desktop');
  return breakpoint;
};