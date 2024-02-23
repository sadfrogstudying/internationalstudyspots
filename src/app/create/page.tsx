// import { redirect } from "next/navigation";
// import { getServerAuthSession } from "@/server/auth";
import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";
import UserOptionalWrapper from "@/components/user-optional-wrapper";
import ReactQueryHydrate from "@/components/react-query-hydrate";
import { createSSRHelper } from "@/server/api/ssr";
import { dehydrate } from "@tanstack/react-query";

const CreateSpotFormController = dynamic(
  () =>
    import("@/components/create-update-spot-form/create-spot-form-controller"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-96 w-full" />,
  },
);

export default async function CreateSpotPage() {
  // const session = await getServerAuthSession();
  // if (!session) redirect("/auth/signin");

  const helpers = await createSSRHelper();
  await helpers.user.currentBySession.prefetch();
  const dehydratedState = dehydrate(helpers.queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <UserOptionalWrapper>
        <CreateSpotFormController />
      </UserOptionalWrapper>
    </ReactQueryHydrate>
  );
}
