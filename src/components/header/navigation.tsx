"use client";

import dynamic from "next/dynamic";
import { api } from "@/trpc/react";
import { Menu, X } from "lucide-react";

import MobileMenu from "@/components/header/mobile-menu";
import UnauthedNav from "@/components/header/unauthed-nav";
import AuthedNav from "@/components/header/authed-nav";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const UserAvatarPopover = dynamic(
  () => import("@/components/header/user-avatar-popover"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-9 w-9 rounded-full" />,
  },
);

export default function Navigation({}) {
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
                <NavItems onClick={close} />
              </nav>
            </>
          );
        }}
      />

      <nav className="pointer-events-auto hidden h-9 items-center gap-4 text-base md:flex">
        <NavItems />
      </nav>

      <UserAvatarPopover />
    </div>
  );
}

function NavItems({ onClick }: { onClick?: () => void }) {
  const { data, isLoading } = api.user.currentBySession.useQuery(undefined);

  return (
    <>
      {!data && <UnauthedNav onClick={onClick} />}
      {data && !isLoading && <AuthedNav onClick={onClick} />}
    </>
  );
}
