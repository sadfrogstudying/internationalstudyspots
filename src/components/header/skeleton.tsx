import { Avatar, AvatarFallback } from "../ui/avatar";
import { Link } from "@/components/ui/link";

export default function HeaderSkeleton() {
  return (
    <header className="pointer-events-none sticky top-0 z-30 mx-auto flex w-full max-w-screen-4xl cursor-default justify-between gap-8 px-4 py-4 text-2xl">
      <div className="flex items-center">
        <h1>
          <Link href="/" className="pointer-events-auto flex flex-wrap gap-x-2">
            <span className="hidden xs:block">
              International <strong>Study Spots</strong>
            </span>
            <span className="xs:hidden">
              I<strong>SS</strong>
            </span>
          </Link>
        </h1>
      </div>
      <Avatar className="pointer-events-auto h-9 w-9 cursor-wait">
        <AvatarFallback />
      </Avatar>
    </header>
  );
}
