import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import UnmountAfter from "@/components/unmount-after";

type NextImageProps = React.ComponentProps<typeof Image>;
/**
 * Might be subject to change, if I adopt SSR skeleton approach,
 * where the skeleton is decoupled from the components.
 */
interface ImageThatFadesInProps extends Omit<NextImageProps, "src"> {
  src: NextImageProps["src"] | undefined;
  imageReady: boolean;
  skeletonClassName?: string;
}

export function ImageThatFadesIn({
  src,
  imageReady,
  className,
  skeletonClassName,
  ...props
}: ImageThatFadesInProps) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <>
      {src && (
        <Image
          {...props}
          /** Need to explicitly do this due to jsx-a11y/alt-text */
          alt={props.alt}
          src={src}
          onLoad={() => setLoaded(true)}
          className={cn(
            className,
            "transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      <UnmountAfter delay={1250} ready={imageReady}>
        <div
          className={cn(
            "h-full w-full rounded-md bg-white transition-opacity duration-500",
            className,
            loaded ? "opacity-0" : "opacity-100",
          )}
        >
          <Skeleton className={cn("h-full w-full", skeletonClassName)} />
        </div>
      </UnmountAfter>
    </>
  );
}
