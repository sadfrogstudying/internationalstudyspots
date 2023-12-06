import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionVariants = cva("", {
  variants: {
    variant: {
      default: "border border-blue-400",
      alternate: "",
      ghost: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
const headerVariants = cva("px-6 text-base font-bold text-primary-foreground", {
  variants: {
    variant: {
      default: "bg-blue-400",
      alternate: "bg-orange-300 text-orange-500",
      ghost: "sr-only",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
const contentVariants = cva("", {
  variants: {
    variant: {
      default: "p-2",
      alternate: "p-2",
      ghost: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  title: string;
  children: React.ReactNode;
}

export default function Section({
  children,
  title,
  variant,
  className,
  ...props
}: SectionProps) {
  return (
    <section className={cn(sectionVariants({ variant, className }))} {...props}>
      <h3 className={cn(headerVariants({ variant }))}>{title}</h3>
      <div className={cn(contentVariants({ variant }))}>{children}</div>
    </section>
  );
}
