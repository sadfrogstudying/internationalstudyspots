import * as React from "react";

import { cn } from "@/lib/utils";
import NextLink from "next/link";

const Link = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof NextLink>
>(({ className, ...props }, ref) => {
  return (
    <NextLink
      className={cn(
        "rounded-sm outline-2 outline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:outline active:outline-purple-600",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Link.displayName = "Link";

export { Link };
