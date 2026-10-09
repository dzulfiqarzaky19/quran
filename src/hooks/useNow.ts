import { useSyncExternalStore } from 'react';

const subscribe = (onTick: () => void) => {
  const interval = setInterval(onTick, 1000);
  return () => clearInterval(interval);
};

const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => null;

/**
 * The current time, ticking once a second. Null on the server and during
 * hydration, so clock-dependent UI renders a placeholder instead of mismatching.
 */
export function useNow(): Date | null {
  const seconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return seconds === null ? null : new Date(seconds * 1000);
}
