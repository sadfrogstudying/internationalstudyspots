"use client";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { api } from "@/trpc/react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function UserOptionalWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // user loading will be true if the prefetch for currentBySession failed (no user)
  const { data: user, isLoading: userLoading } =
    api.user.currentBySession.useQuery();

  const [isPreview, setIsPreview] = useState(false);

  if (!user && !isPreview) {
    return (
      <>
        <p className="text-gray-500">Please create an account to continue.</p>
        <div className="flex max-w-sm flex-wrap gap-2">
          <Button
            className="flex-grow"
            onClick={() => {
              void signIn(undefined, { callbackUrl: `/` });
            }}
            variant="success"
          >
            Create account
          </Button>

          <Button
            variant="default"
            onClick={() => setIsPreview(true)}
            className="flex-grow"
          >
            I just want to have a look
          </Button>
        </div>
      </>
    );
  }

  // If user exists but no username
  if (!user?.username && !userLoading && !isPreview) {
    return (
      <>
        <p className="text-gray-500">
          You need to finish creating your account before you can continue.
        </p>
        <div className="flex max-w-sm flex-wrap gap-2">
          <Button asChild variant="success" className="flex-grow">
            <Link href={`/account/edit`}>Finish Account</Link>
          </Button>
          <Button
            variant="default"
            onClick={() => setIsPreview(true)}
            className="flex-grow"
          >
            I just want to have a look
          </Button>
        </div>
      </>
    );
  }

  return <>{children}</>;
}
