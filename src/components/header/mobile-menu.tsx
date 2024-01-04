import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function MobileMenu({
  render,
  renderTrigger,
}: {
  render: (close: () => void) => React.ReactNode;
  renderTrigger: (open: boolean) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{renderTrigger(open)}</PopoverTrigger>
      <PopoverContent className="mt-4 text-sm" align="end">
        {render(() => setOpen(false))}
      </PopoverContent>
    </Popover>
  );
}
