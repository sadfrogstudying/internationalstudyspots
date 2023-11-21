"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import Info from "./info";
import { Button } from "../ui/button";

const Filter = dynamic(() => import("./filter"), {
  loading: () => <div />,
});
const SheetBase = dynamic(() => import("./sheet-base"), {
  loading: () => <Button variant="ghost">Loading...</Button>,
});

export default function HolyGrailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-8 p-8 lg:flex-row lg:p-4">
      <div className="grid grid-cols-2 border-y border-black lg:hidden">
        <SheetBase
          trigger={<Button variant="ghost">Filters</Button>}
          title="Filters"
        >
          <Filter />
        </SheetBase>

        <SheetBase trigger={<Button variant="ghost">Info</Button>} title="Info">
          <Info />
        </SheetBase>
      </div>

      <Column className="hidden lg:block">
        <Filter />
      </Column>

      {children}

      <Column className="hidden lg:block">
        <div className="w-40 text-right">
          <Info />
        </div>
      </Column>
    </section>
  );
}

interface ColumnProps extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
}

function Column({ children, className, ...props }: ColumnProps) {
  return (
    <div
      className={cn(
        `sticky top-0 hidden h-screen w-44 flex-shrink-0 lg:block`,
        className,
      )}
      {...props}
    >
      <div className="absolute top-24 w-full">{children}</div>
    </div>
  );
}
