"use client";

import { AlertCircle } from "lucide-react";
import { Link } from "@/components/ui/link";

export default function NewUserAnnouncementBar() {
  return (
    <div
      className="sticky bottom-0 z-10 flex w-full animate-fade-in items-center bg-lime-500 transition-all"
      role="alert"
    >
      <Link
        href={`/account/edit`}
        className="flex h-full w-full gap-2 px-4 py-4 text-white ring-offset-0"
      >
        <span>
          <AlertCircle />
        </span>
        Click here to complete creating your account, needed before you can add
        spots and view your profile.
      </Link>
    </div>
  );
}
