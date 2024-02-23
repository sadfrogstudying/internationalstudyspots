import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import UserStatusWrapper from "./user-status-wrapper";
import ReactQueryHydrate from "@/components/react-query-hydrate";
import { createSSRHelper } from "@/server/api/ssr";
import { dehydrate } from "@tanstack/react-query";

import EditSpotFormController from "@/components/create-update-spot-form/edit-spot-form-controller";

export default async function EditSpotPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerAuthSession();

  if (!session) redirect("/auth/signin");

  const helpers = await createSSRHelper();
  await Promise.all([
    helpers.user.currentBySession.prefetch(),
    helpers.studySpot.bySlug.prefetch(params.slug),
  ]);
  const dehydratedState = dehydrate(helpers.queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <UserStatusWrapper>
        <EditSpotFormController slug={params.slug} />
      </UserStatusWrapper>
    </ReactQueryHydrate>
  );
}
