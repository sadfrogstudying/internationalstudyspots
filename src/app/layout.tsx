import "@/styles/globals.css";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";

import Header from "@/components/header";
import { FilterController } from "@/components/study-spot-grid/filter-context";

import { Inter } from "next/font/google";
import Footer from "@/components/footer";

import Providers from "@/components/progress-bar-provider";

export const metadata = {
  title: "International Study Spots",
  description:
    "Find and share the best study spots around the world.  From cafes, to libraries, to parks, we HAVE GOT YOU COVERED.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

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
      <body
        className={`flex min-h-full flex-col justify-between antialiased ${inter.className}`}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <FilterController>
            <div>
              <Header />
              <Providers>{children}</Providers>
            </div>

            <Footer />
          </FilterController>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
