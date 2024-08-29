import { useEffect, useRef, EffectCallback, DependencyList } from "react";

export default function useUpdateEffect(
  callback: EffectCallback,
  dependencies: DependencyList
): void {
  const firstRenderRef = useRef<boolean>(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    return callback();
  }, dependencies);
}
