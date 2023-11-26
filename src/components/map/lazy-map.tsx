"use client";

import dynamic from "next/dynamic";
import { type ComponentProps } from "react";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function LazyMap({ ...props }: ComponentProps<typeof Map>) {
  return <Map {...props} />;
}
