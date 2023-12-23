"use client";

import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import MobileMenu from "./mobile-menu";

export default function NavigationLayout({
  children,
  userAvatar,
}: {
  children: React.ReactNode;
  userAvatar: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <MobileMenu
        trigger={(open) => {
          return (
            <Button
              className="pointer-events-auto flex items-center rounded-full md:hidden"
              size="icon"
              variant="ghost"
            >
              {open ? <X /> : <Menu />}
            </Button>
          );
        }}
      >
        <nav className="flex flex-col gap-4">{children}</nav>
      </MobileMenu>

      <nav className="pointer-events-auto hidden h-9 items-center gap-4 text-base md:flex">
        {children}
      </nav>

      {userAvatar}
    </div>
  );
}
