"use client";

import { Link } from "@/components/ui/link";

export default function AuthedNav({ onClick }: { onClick?: () => void }) {
  return (
    <>
      <Link
        href="/map"
        className="pointer-events-auto flex gap-x-2"
        onClick={onClick}
      >
        Map
      </Link>

      <Link
        href="/create"
        className="pointer-events-auto underline"
        onClick={onClick}
      >
        Add Spot
      </Link>
    </>
  );
}
