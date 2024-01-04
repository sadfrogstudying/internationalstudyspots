import { useState } from "react";
import { useEventListener } from "./use-event-listener";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";
import { debounce } from "lodash";

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const debouncedHandleSize = debounce(handleSize, 750);

  useEventListener("resize", debouncedHandleSize);

  // Set size at the first client-side load
  useIsomorphicLayoutEffect(() => {
    handleSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return windowSize;
}
