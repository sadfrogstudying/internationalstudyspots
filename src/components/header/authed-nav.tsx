"use client";
import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "../ui/link";
import { cn } from "@/lib/utils";

export default function AuthedNav() {
  const { data } = api.user.currentBySession.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

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

      <Link
        aria-disabled={!data}
        href={`/account/${data?.username}`}
        className={cn(
          "pointer-events-auto rounded text-right",
          !data && "pointer-events-none opacity-30",
        )}
      >
        <Avatar className="h-9 w-9 shadow">
          <AvatarImage src={data?.profileImage?.url} className="object-cover" />
          <AvatarFallback />
        </Avatar>
      </Link>
    </>
  );
}
