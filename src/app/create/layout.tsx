import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) redirect("/auth/signin");

  return (
    <div className="space-y-4 p-4">
      <div className="rounded border p-4">
        <h1 className="mb-4 text-lg font-bold underline">Create New Spot 🧭</h1>
        {children}
      </div>
    </div>
  );
}
