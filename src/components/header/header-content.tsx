"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";

import Navigation from "@/components/header/navigation";
import { Link } from "@/components/ui/link";
import { Avatar, AvatarFallback } from "../ui/avatar";

const NewUserAnnouncementBar = dynamic(
  () => import("@/components/header/new-user-announcement-bar"),
  { ssr: false },
);

export default function HeaderContent() {
  const { data, isLoading } = api.user.currentBySession.useQuery(undefined);
  const pathname = usePathname();

  return (
    <>
      <header
        className={cn(
          "pointer-events-none sticky top-0 z-30 mx-auto flex w-full cursor-default justify-between gap-8 px-4 py-4 text-2xl",
          pathname === "/" || pathname === "/map"
            ? "max-w-screen-4xl"
            : "max-w-screen-2xl",
        )}
      >
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

        {isLoading ? (
          <Avatar className="pointer-events-auto h-9 w-9 cursor-wait">
            <AvatarFallback />
          </Avatar>
        ) : (
          <Navigation />
        )}
      </header>

      {data && !data.username && !isLoading && <NewUserAnnouncementBar />}
    </>
  );
}
