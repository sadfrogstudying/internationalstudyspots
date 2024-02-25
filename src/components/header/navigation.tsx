"use client";

import dynamic from "next/dynamic";
import { Menu, X } from "lucide-react";

import MobileMenu from "@/components/header/mobile-menu";
import UnauthedNav from "@/components/header/unauthed-nav";
import AuthedNav from "@/components/header/authed-nav";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { RouterOutputs } from "@/trpc/shared";

const UserAvatarPopover = dynamic(
  () => import("@/components/header/user-avatar-popover"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-9 w-9 rounded-full" />,
  },
);

type User = RouterOutputs["user"]["currentBySession"];

export default function Navigation({ user }: { user: User | undefined }) {
  return (
    <div className="flex items-center gap-4">
      <MobileMenu
        renderTrigger={(open) => {
          return (
            <Button
              className="pointer-events-auto flex items-center rounded-full bg-white shadow-md md:hidden"
              size="icon"
              variant="ghost"
            >
              {open ? <X /> : <Menu />}
            </Button>
          );
        }}
        render={(close) => {
          return (
            <>
              <div className="mb-4 font-bold">Menu</div>
              <nav className="flex flex-col gap-4">
                <NavItems onClick={close} user={user} />
              </nav>
            </>
          );
        }}
      />

      <nav className="pointer-events-auto hidden h-9 items-center gap-4 text-base md:flex">
        <NavItems user={user} />
      </nav>

      <UserAvatarPopover user={user} />
    </div>
  );
}

function NavItems({
  onClick,
  user,
}: {
  onClick?: () => void;
  user: User | undefined;
}) {
  return (
    <>
      {!user && <UnauthedNav onClick={onClick} />}
      {user && <AuthedNav onClick={onClick} />}
    </>
  );
}
