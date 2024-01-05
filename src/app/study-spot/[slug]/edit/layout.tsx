import { getServerAuthSession } from "@/server/auth";
import UserStatusWrapper from "./user-status-wrapper";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) redirect("/auth/signin");

  return (
    <div className="mx-auto max-w-screen-2xl space-y-4 p-4">
      <div className="space-y-4 rounded border p-4">
        <h1 className="mb-4 text-lg font-bold underline">Edit Spot 🔧</h1>
        <UserStatusWrapper>{children}</UserStatusWrapper>
      </div>
    </div>
  );
}
