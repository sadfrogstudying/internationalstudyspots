import { getServerAuthSession } from "@/server/auth";
import NavigationLayout from "./navigation-layout";
import UnauthedNav from "./unauthed-nav";
import AuthedNav from "./authed-nav";
import { Link } from "../ui/link";

export default async function Header() {
  const session = await getServerAuthSession();

  return (
    <header className="pointer-events-none sticky top-0 z-30 flex w-full cursor-default justify-between gap-8 bg-white/20 px-4 py-4 text-2xl">
      <div>
        <h1>
          <Link href="/" className="pointer-events-auto flex flex-wrap gap-x-2">
            International <strong>Study Spots</strong>
          </Link>
        </h1>
      </div>

      <NavigationLayout>
        {!session && <UnauthedNav />}
        {session && <AuthedNav />}
      </NavigationLayout>
    </header>
  );
}
