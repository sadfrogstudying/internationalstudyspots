"use client";

import { Link } from "@/components/ui/link";

export default function AuthedNav() {
  return (
    <>
      <Link href="/map" className="pointer-events-auto flex gap-x-2">
        Map
      </Link>

      <Link href="/create" className="pointer-events-auto underline">
        Add Spot
      </Link>
    </>
  );
}
