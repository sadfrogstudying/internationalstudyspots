import { createSSRHelper } from "@/server/api/ssr";
import ReactQueryHydrate from "../react-query-hydrate";
import HeaderContent from "./header-content";
import { dehydrate } from "@tanstack/react-query";

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
