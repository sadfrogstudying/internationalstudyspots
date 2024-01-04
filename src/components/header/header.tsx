"use client";

import { Link } from "@/components/ui/link";
import NavigationLayout from "@/components/header/navigation-layout";
import UnauthedNav from "@/components/header/unauthed-nav";
import AuthedNav from "@/components/header/authed-nav";

import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";
import { api } from "@/trpc/react";

const UserAvatarPopover = dynamic(
  () => import("@/components/header/user-avatar-popover"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-9 w-9 rounded-full" />,
  },
);

const NewUserAnnouncementBar = dynamic(
  () => import("@/components/header/new-user-announcement-bar"),
  { ssr: false },
);

export default function Header() {
  const { data, isLoading } = api.user.currentBySession.useQuery(undefined);

  return (
    <>
      <header className="pointer-events-none sticky top-0 z-30 flex w-full cursor-default justify-between gap-8 bg-white/20 px-4 py-4 text-2xl">
        <div className="flex items-center">
          <h1>
            <Link
              href="/"
              className="pointer-events-auto flex flex-wrap gap-x-2"
            >
              <span className="hidden xs:block">
                International <strong>Study Spots</strong>
              </span>
              <span className="xs:hidden">
                I<strong>SS</strong>
              </span>
            </Link>
          </h1>
        </div>

        <NavigationLayout userAvatar={<UserAvatarPopover />}>
          {!data && <UnauthedNav />}
          {data && !isLoading && <AuthedNav />}
        </NavigationLayout>
      </header>

      {data && !data.username && !isLoading && <NewUserAnnouncementBar />}
    </>
  );
}
