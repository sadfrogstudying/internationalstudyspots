import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import UserStatusWrapper from "./user-status-wrapper";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) redirect("/auth/signin");

  return (
    <div className="mx-auto max-w-screen-2xl space-y-4 p-4">
      <div className="rounded border p-4">
        <h1 className="mb-4 text-lg font-bold underline">Edit User 👶</h1>
        <UserStatusWrapper>{children}</UserStatusWrapper>
      </div>
    </div>
  );
}
