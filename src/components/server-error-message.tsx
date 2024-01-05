import { cn } from "@/lib/utils";
import { type TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";

export default function ServerErrorMessage({
  message,
  code,
  className,
}: {
  message?: string;
  code?: TRPC_ERROR_CODE_KEY;
  className?: string;
}) {
  function getErrorMessage(code?: TRPC_ERROR_CODE_KEY) {
    switch (code) {
      case "INTERNAL_SERVER_ERROR":
        return "An error occured on the server, please try again.";
      case "NOT_FOUND":
        return "The requested resource was not found.";
      case "UNAUTHORIZED":
        return "You are not authorized to perform this action.";
      case "FORBIDDEN":
        return "You are not allowed to perform this action.";
      case "BAD_REQUEST":
        return "The request was malformed.";
      default:
        return "An error occured on the server, please try again.";
    }
  }

  if (!code) return null;

  return (
    <div
      role="alert"
      className={cn("text-[0.8rem] text-destructive", className)}
    >
      <strong>An error occured on the server.</strong>
      <div className="text-[0.8rem] font-medium">
        {message ?? getErrorMessage(code)}
      </div>
    </div>
  );
}
