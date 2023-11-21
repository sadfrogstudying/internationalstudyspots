"use client";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function AccountPage() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">{error.message}</div>;

  if (user) {
    return (
      <div className="p-4">
        <div>
          Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
        </div>
      </div>
    );
  }

  return (
    <a className="p-4" href="/api/auth/login">
      Login
    </a>
  );
}
