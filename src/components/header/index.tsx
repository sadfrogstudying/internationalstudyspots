import Link from "next/link";
import Navigation from "./navigation";

export default function Header() {
  return (
    <header className="pointer-events-none sticky top-0 z-30 flex w-full cursor-default justify-between gap-8 bg-white/20 px-8 py-4 text-2xl lg:px-4">
      <div>
        <h1>
          <Link href="/" className="pointer-events-auto flex flex-wrap gap-x-2">
            International <strong>Study Spots</strong>
          </Link>
        </h1>
      </div>

      <Navigation />
    </header>
  );
}
