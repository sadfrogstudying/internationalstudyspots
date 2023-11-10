import { cn } from "@/lib/utils";
import Image from "next/image";
import * as React from "react";

/**
 * Just used for testing
 */
const SimulatedSlowImage = (
  props: React.ComponentPropsWithoutRef<typeof Image>,
) => {
  const [loaded, setLoaded] = React.useState(false);
  const { src, alt, width, height, sizes, className } = props;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setLoaded(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Image
      src={loaded ? src : ""}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        "object-cover transition-opacity duration-500",
        loaded ? "opacity-100" : "opacity-0",
        className,
      )}
      sizes={sizes}
    />
  );
};

SimulatedSlowImage.displayName = "SimulatedSlowImage";

export default SimulatedSlowImage;
