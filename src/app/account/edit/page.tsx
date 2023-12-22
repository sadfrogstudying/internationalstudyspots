"use client";

import dynamic from "next/dynamic";
import { signIn } from "next-auth/react";
import { Link } from "@/components/ui/link";
import { api } from "@/trpc/react";

const EditUserForm = dynamic(() => import("@/components/edit-user-form"), {
  ssr: false,
  loading: () => <span>Loading Form 📝...</span>,
});

export default function EditAccountPage() {
  return (
    <Layout>
      <Content />
    </Layout>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 p-4">
      <div className="rounded border p-4">
        <h1 className="mb-4 text-lg font-bold underline">Edit User 👶</h1>
        {children}
      </div>
    </div>
  );
}

function Content() {
  const { data, isLoading } = api.user.currentBySession.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (!data && !isLoading)
    return (
      <p>
        Please create an account first. Click{" "}
        <Link href={`/account/create`} className="underline" asChild>
          <span
            onClick={() => signIn(undefined, { callbackUrl: `/account` })}
            aria-label="Sign In"
            className="cursor-pointer"
          >
            Sign In
          </span>
        </Link>
      </p>
    );

  if (isLoading) return <p>Loading User 🤦‍♂️...</p>;

  return <EditUserForm />;
}
