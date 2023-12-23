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
      <AccordionTrigger className="text-lg font-bold">{label}</AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItemBase>
  );
}
