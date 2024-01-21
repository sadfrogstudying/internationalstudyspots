"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { Link } from "../ui/link";
import { cn } from "@/lib/utils";

export default function UnauthedNav({
  onClick,
  loading,
}: {
  onClick?: () => void;
  loading?: boolean;
}) {
  return (
    <>
      <Link
        href="/map"
        className="pointer-events-auto flex flex-wrap gap-x-2 underline"
        onClick={onClick}
      >
        Map
      </Link>
      <Button
        onClick={() => {
          void signIn(undefined, { callbackUrl: `/account` });
          onClick?.();
        }}
        variant="success"
        disabled={loading}
        className={cn(loading && "opacity-50")}
      >
        Sign In
      </Button>
    </>
  );
}
