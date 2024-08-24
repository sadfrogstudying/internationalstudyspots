// import { redirect } from "next/navigation";
// import { getServerAuthSession } from "@/server/auth";
import UserOptionalWrapper from "@/components/user-optional-wrapper";
import ReactQueryHydrate from "@/components/react-query-hydrate";
import { createSSRHelper } from "@/server/api/ssr";
import { dehydrate } from "@tanstack/react-query";

import EditSpotFormController from "@/components/create-update-spot-form/edit-spot-form-controller";

export default async function EditSpotPage({
  params,
}: {
  params: { id: string };
}) {
  // const session = await getServerAuthSession();
  // if (!session) redirect("/auth/signin");

  const id = Number(params.id);

  const helpers = await createSSRHelper();
  await Promise.all([
    helpers.user.currentBySession.prefetch(),
    helpers.studySpot.byId.prefetch(id),
  ]);
  const dehydratedState = dehydrate(helpers.queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <UserOptionalWrapper>
        <EditSpotFormController id={id} />
      </UserOptionalWrapper>
    </ReactQueryHydrate>
  );
}
