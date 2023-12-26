import { cn } from "@/lib/utils";

export default function ServerErrorMessage({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn("text-[0.8rem] text-destructive", className)}
    >
      <strong>An error occured on the server, please try again.</strong>
      <div className="text-[0.8rem] font-medium">Message: {message}</div>
    </div>
  );
}
