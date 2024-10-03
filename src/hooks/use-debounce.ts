import { useEffect } from "react";
import useTimeout from "./use-timeout";

type UseDebounceCallback = () => void;

export default function useDebounce(
  callback: UseDebounceCallback,
  delay: number,
  dependencies: any[]
) {
  const { reset, clear } = useTimeout(callback, delay);

  useEffect(reset, [...dependencies, reset]);
  useEffect(clear, []);
}
