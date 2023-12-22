"use client";
import { signOut } from "next-auth/react";

import UserAvatar from "@/components/header/user-avatar";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

export default function AuthedNav() {
  return (
    <>
      <Link href="/map" className="pointer-events-auto flex flex-wrap gap-x-2">
        Map
      </Link>

      <Link href="/create" className="pointer-events-auto text-right underline">
        Add Spot
      </Link>

      <Button
        onClick={() =>
          signOut({
            callbackUrl: "/",
          })
        }
        variant="destructive"
      >
        Sign Out
      </Button>

      <UserAvatar />
    </>
  );
}
