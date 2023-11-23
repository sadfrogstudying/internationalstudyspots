import {
  AccordionContent,
  AccordionItem as AccordionItemBase,
  AccordionTrigger,
} from "../ui/accordion";

export function AccordionItem({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <AccordionItemBase value={label}>
      <AccordionTrigger className="text-base">{label}</AccordionTrigger>
      <AccordionContent>
        <div className="rounded border border-neutral-400">
          <div className="grid grid-cols-1 gap-4 border-l-4 border-neutral-400 p-4 sm:grid-cols-2 md:grid-cols-4">
            {children}
          </div>
        </div>
      </AccordionContent>
    </AccordionItemBase>
  );
}
