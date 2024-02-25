import HeaderContent from "./header-content";
import { createSSRHelper } from "@/server/api/ssr";
import { dehydrate } from "@tanstack/react-query";
import ReactQueryHydrate from "@/components/react-query-hydrate";

export default async function Header() {
  const helpers = await createSSRHelper();
  await helpers.user.currentBySession.prefetch();
  const dehydratedState = dehydrate(helpers.queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <HeaderContent />
    </ReactQueryHydrate>
  );
}
