import "@/styles/globals.css";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";

import Header from "@/components/header";
import { FilterController } from "@/components/study-spot-grid/filter-context";

import {
  // Abel,
  Inter,
} from "next/font/google";

export const metadata = {
  title: "International Study Spots",
  description:
    "Find and share the best study spots around the world.  From cafes, to libraries, to parks, we HAVE GOT YOU COVERED.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// const abel = Abel({
//   subsets: ["latin"],
//   weight: ["400"],
// });
const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`min-h-full antialiased ${inter.className}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <FilterController>
            <Header />
            {children}
          </FilterController>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
