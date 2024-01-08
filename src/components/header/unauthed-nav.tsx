"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { Link } from "../ui/link";

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
      >
        {loading ? "Loading..." : "Sign In"}
      </Button>
    </>
  );
}
