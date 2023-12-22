import * as React from "react";

import { cn } from "@/lib/utils";
import NextLink from "next/link";

import { Slot } from "@radix-ui/react-slot";

type LinkProps = React.ComponentProps<typeof NextLink> & {
  asChild?: boolean;
};

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : NextLink;

    return (
      <Comp
        className={cn(
          "rounded-sm outline-2 outline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:outline active:outline-purple-600",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Link.displayName = "Link";

export { Link };
