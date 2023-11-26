"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import MobileMenu from "./mobile-menu";

export default function Navigation() {
  return (
    <NavigationLayout>
      <Link href="/" className="pointer-events-auto flex flex-wrap gap-x-2">
        Map
      </Link>
      <Button
        variant="success"
        className="pointer-events-auto text-right"
        asChild
      >
        <Link href="/create" className="pointer-events-auto">
          Add Spot
        </Link>
      </Button>
      <Link href="/account" className="pointer-events-auto rounded text-right">
        <Avatar className="h-9 w-9 shadow">
          <AvatarFallback className="text-gray-400">CZ</AvatarFallback>
        </Avatar>
      </Link>
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
