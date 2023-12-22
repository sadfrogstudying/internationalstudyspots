"use client";
import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "../ui/link";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/header/user-avatar";

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
