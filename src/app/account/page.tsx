"use client";
import Account from "@/components/account";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function AccountPage() {
  const { user, error, isLoading } = useUser();

  if (isLoading)
    return (
      <main className="w-full bg-neutral-100 p-4 text-sm">Loading...</main>
    );

  if (error)
    return (
      <main className="w-full bg-neutral-100 p-4 text-sm">{error.message}</main>
    );

  if (user) {
    return (
      <main className="w-full bg-neutral-100 p-4 text-sm">
        <Account />
      </main>
    );
  }

  return (
    <main className="w-full bg-neutral-100 p-4 text-sm">
      <a href="/api/auth/login">Login</a>
    </main>
  );
}
