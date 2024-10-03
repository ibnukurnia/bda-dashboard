import { useCallback, useEffect, useRef } from "react";

export default function useTimeout(callback: () => void, delay: number) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Step 3: Update callbackRef when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Step 4: Define set method to start the timeout
  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
  }, [delay]);

  // Step 5: Define clear method to clear the timeout
  const clear = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Step 6: Start the timeout when delay or dependencies change
  useEffect(() => {
    set();
    return clear; // Cleanup when the component unmounts
  }, [delay, set, clear]);

  // Step 7: Define reset method to clear and restart the timeout
  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  // Step 8: Return reset and clear for external use
  return { reset, clear };
}
