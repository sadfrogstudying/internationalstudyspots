import * as React from "react";

/** Unmounts the component after delay */
export default function UnmountAfter({
  children,
  delay,
  ready = true,
}: {
  children: React.ReactNode;
  delay: number;
  ready?: boolean;
}) {
  const [mounted, setMounted] = React.useState(true);

  React.useEffect(() => {
    if (!ready) return;

    const timeout = setTimeout(() => {
      setMounted(false);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, ready]);

  return mounted ? children : null;
}
