"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { Link } from "../ui/link";

export default function UnauthedNav() {
  return (
    <>
      <Link
        href="/map"
        className="pointer-events-auto flex flex-wrap gap-x-2 underline"
      >
        Map
      </Link>
      <Button
        onClick={() => signIn(undefined, { callbackUrl: `/account` })}
        variant="success"
      >
        Sign In
      </Button>
    </>
  );
}
