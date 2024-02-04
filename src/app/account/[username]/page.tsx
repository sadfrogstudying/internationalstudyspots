import AccountDetails from "@/components/account-details";
import ReactQueryHydrate from "@/components/react-query-hydrate";
import { createSSRHelper } from "@/server/api/ssr";
import { dehydrate } from "@tanstack/react-query";
import {
  type Metadata,
  // type ResolvingMetadata
} from "next";

type Props = {
  params: { username: string };
};

export function generateMetadata(
  { params }: Props,
  // parent: ResolvingMetadata,
): Metadata {
  // read route params
  const username = params.username;

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images ?? []
  return {
    title: username
      ? `${username} - International Study Spots`
      : "International Study Spots",
    description: `User page for ${username}`,
    // openGraph: {
    //   images: ['/some-specific-page-image.jpg', ...previousImages],
    // },
  };
}

export default async function AccountPage({
  params,
}: {
  params: { username: string };
}) {
  // 1. create the server-side helper
  const helpers = await createSSRHelper();
  // 2. pre-fetch the tRPC procedure server-side
  await helpers.user.get.prefetch(params.username);
  // 3. get the dehydrated query client and pass it down to react-query's context provider
  const dehydratedState = dehydrate(helpers.queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <AccountDetails />
    </ReactQueryHydrate>
  );
}
