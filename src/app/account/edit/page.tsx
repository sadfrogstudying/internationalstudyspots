import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { dehydrate } from "@tanstack/react-query";

import ReactQueryHydrate from "@/components/react-query-hydrate";
import { createSSRHelper } from "@/server/api/ssr";
import { getServerAuthSession } from "@/server/auth";

import { Skeleton } from "@/components/ui/skeleton";

const EditUserFormController = dynamic(
  () => import("@/components/edit-user-form/edit-user-form-controller"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-96 w-full" />,
  },
);

export default async function EditAccountPage() {
  const session = await getServerAuthSession();
  if (!session) redirect("/auth/signin");

  const helpers = await createSSRHelper();
  await helpers.user.currentBySession.prefetch();
  const dehydratedState = dehydrate(helpers.queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <EditUserFormController />
    </ReactQueryHydrate>
  );
}
