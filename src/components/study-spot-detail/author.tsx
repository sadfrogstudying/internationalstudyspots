import { type RouterOutputs } from "@/trpc/shared";

import { cn } from "@/lib/utils";

import UnmountAfter from "@/components/unmount-after";
import { Link } from "@/components/ui/link";
import { SkeletonText } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Author = RouterOutputs["studySpot"]["authorBySlug"];

export default function Author({ author }: { author?: Author }) {
  const durationTiming = 500;
  const animationDuration = `duration-${durationTiming}`;
  const timingOffset = 200;

  return (
    <Link
      href={`/account/${author?.username}`}
      className={cn(
        "flex w-fit items-center gap-2 text-sm",
        !author && "pointer-events-none",
      )}
    >
      <Avatar className="h-6 w-6 shadow">
        <AvatarImage src={author?.profileImage?.url} className="object-cover" />
        <AvatarFallback>{author?.name?.[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
      {author ?? author === null ? (
        <span>
          <UnmountAfter delay={timingOffset}>
            <SkeletonText
              className={cn(
                "absolute w-36 animate-fade-out opacity-0",
                animationDuration,
              )}
            />
          </UnmountAfter>
          <strong>
            {author?.name ?? author?.username ?? "Unknown Person"}{" "}
          </strong>
          found this spot
        </span>
      ) : (
        <SkeletonText className="w-56" />
      )}
    </Link>
  );
}
