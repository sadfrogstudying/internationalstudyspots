import * as React from "react";

/** Unmounts the component after delay */
export default function UnmountAfter({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  const [mounted, setMounted] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(false);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  return mounted ? children : null;
}
