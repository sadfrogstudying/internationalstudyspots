import { Button } from "../ui/button";
import MobileMenu from "./mobile-menu";

export default function NavigationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

      <nav className="pointer-events-auto hidden h-9 items-center gap-4 text-base md:flex">
        {children}
      </nav>
    </>
  );
}
