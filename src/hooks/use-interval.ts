import { useEffect, useRef } from 'react';

// Custom hook for interval management with an on/off switch
function useInterval(callback: () => void, delay: number | null, isRunning: boolean) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    if (!isRunning || delay === null) return; // Stop interval if not running or delay is null

    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id); // Cleanup on unmount or when delay changes
  }, [delay, isRunning]); // Depend on delay and isRunning to control behavior
}

export default useInterval;
