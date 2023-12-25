"use client";
import { api } from "@/trpc/react";

export default function UserStatusWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading: userLoading } =
    api.user.currentBySession.useQuery(undefined);

  if (userLoading) return <p>Loading User 🤦‍♂️...</p>;

  return <>{children}</>;
}
