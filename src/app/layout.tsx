import "@/styles/globals.css";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import { UserProvider } from "@auth0/nextjs-auth0/client";

import Header from "@/components/header";
import { FilterController } from "@/components/study-spot-grid/filter-context";

export const metadata = {
  title: "International Study Spots",
  description:
    "Find and share the best study spots around the world.  From cafes, to libraries, to parks, we HAVE GOT YOU COVERED.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <TRPCReactProvider cookies={cookies().toString()}>
          <UserProvider>
            <FilterController>
              <Header />
              {children}
            </FilterController>
          </UserProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
