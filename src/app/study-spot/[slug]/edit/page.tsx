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
  params: { slug: string };
}) {
  // const session = await getServerAuthSession();
  // if (!session) redirect("/auth/signin");

  const helpers = await createSSRHelper();
  await Promise.all([
    helpers.user.currentBySession.prefetch(),
    helpers.studySpot.bySlug.prefetch(params.slug),
  ]);
  const dehydratedState = dehydrate(helpers.queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <UserOptionalWrapper>
        <div className="mx-auto max-w-screen-2xl space-y-4 p-4">
          <div className="space-y-4 rounded border p-4">
            <h1 className="mb-4 text-lg font-bold underline">Edit Spot 🔧</h1>
            <EditSpotFormController slug={params.slug} />
          </div>
        </div>
      </UserOptionalWrapper>
    </ReactQueryHydrate>
  );
}
