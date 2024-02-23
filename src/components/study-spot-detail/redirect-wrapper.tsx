"use client";

// This wrapper is a client component, but uses children as props
// pattern so its children will not be automatically converted
// to server components
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props
// This client component doesn't need to know what the children will
// eventually be filled by.  It just needes to decide where to place children
// This allows them to be decoupled and rendered independantly.

import { api } from "@/trpc/react";
import { notFound } from "next/navigation";

export default function RedirectWrapper({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug: string;
}) {
  const data = api.studySpot.bySlug.useQuery(slug);

  if (!data) notFound(); // data will always be true (unless bad slug) due to SSR

  return <>{children}</>;
}
