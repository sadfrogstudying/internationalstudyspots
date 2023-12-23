import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function MobileMenu({
  children,
  trigger,
}: {
  children: React.ReactNode;
  trigger: (open: boolean) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger(open)}</PopoverTrigger>
      <PopoverContent className="mt-4 text-sm" align="end">
        {children}
      </PopoverContent>
    </Popover>
  );
}
