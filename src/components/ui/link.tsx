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
          "rounded-sm ring-orange-400 ring-offset-4 transition-shadow duration-75 focus-visible:outline-none focus-visible:ring-2 active:ring-2 active:ring-orange-500",
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
