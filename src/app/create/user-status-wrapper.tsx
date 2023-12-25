"use client";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { api } from "@/trpc/react";

export default function UserStatusWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading: userLoading } =
    api.user.currentBySession.useQuery(undefined);

  if (!user?.username && !userLoading) {
    return (
      <>
        <p className="text-gray-500">
          You need to finish creating your account before you can add spots and
          view your profile.
        </p>
        <Button asChild className="mt-4" variant="success">
          <Link href={`/account/edit`}>Finish Account</Link>
        </Button>
      </>
    );
  }

  if (userLoading) return <p>Checking User 🤦‍♂️...</p>;

  return <>{children}</>;
}
