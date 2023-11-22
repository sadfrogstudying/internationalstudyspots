import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function MobileMenu({
  title,
  children,
  trigger,
  description,
}: {
  title: string;
  children: React.ReactNode;
  trigger: React.ReactNode;
  description?: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="flex flex-col gap-8 transition-none data-[state=closed]:duration-0 data-[state=open]:duration-0">
        <SheetHeader className="sr-only text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        {children}
      </SheetContent>
    </Sheet>
  );
}
