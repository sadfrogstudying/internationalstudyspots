"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import MobileMenu from "./mobile-menu";

export default function Navigation() {
  const { user, isLoading } = useUser();

  const { data } = api.user.currentBySession.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <NavigationLayout>
      {user && !isLoading && (
        <>
          <Link
            href="/create"
            className="pointer-events-auto text-right underline"
          >
            Create
          </Link>

          <a
            href="/api/auth/logout"
            className="pointer-events-auto text-right underline"
          >
            Logout
          </a>

          <Link
            href="/account"
            className="pointer-events-auto rounded text-right"
          >
            <Avatar className="h-9 w-9 shadow">
              <AvatarImage
                src={data?.profilePicture?.url}
                className="object-cover"
              />
              <AvatarFallback />
            </Avatar>
          </Link>
        </>
      )}

      {!user && !isLoading && (
        <>
          <a
            href="/api/auth/login"
            className="pointer-events-auto text-right underline"
          >
            Login
          </a>
          <Button variant="success" className="pointer-events-auto text-right">
            Create Account
          </Button>
        </>
      )}
    </NavigationLayout>
  );
}

function NavigationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MobileMenu
        trigger={
          <Button className="pointer-events-auto md:hidden">Menu</Button>
        }
        title="Mobile Menu"
      >
        <nav className="mt-8 flex flex-col items-end gap-4 text-base">
          {children}
        </nav>
      </MobileMenu>

      <nav className="hidden h-9 items-center gap-4 text-base md:flex">
        {children}
      </nav>
    </>
  );
}