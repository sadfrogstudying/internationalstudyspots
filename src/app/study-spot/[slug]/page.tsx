import ReactQueryHydrate from "@/components/react-query-hydrate";
import StudySpotDetail from "@/components/study-spot-detail";
import { createSSRHelper } from "@/server/api/ssr";
import { db } from "@/server/db";
import { dehydrate } from "@tanstack/react-query";
import { type Metadata } from "next";

/**
 * true: Dynamic segments not included in generateStaticParams are generated on demand.
 * false: Dynamic segments not included in generateStaticParams will return a 404.
 */
export const dynamicParams = true;

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data
  const { name, state, country, wifi, powerOutlets } =
    (await db.studySpot.findUnique({
      where: {
        slug,
      },
      select: {
        name: true,
        state: true,
        country: true,
        wifi: true,
        powerOutlets: true,
      },
    })) ?? {};

  const wifiString = wifi ? "Has wifi." : null;
  const powerOutletsString = powerOutlets ? "Has power outlets." : null;
  const descriptionString = name
    ? `${name} in ${state}, ${country}. ${wifiString} ${powerOutletsString}`
    : null;

  return {
    title: name
      ? `${name} - International Study Spots`
      : "International Study Spots",
    description: descriptionString ?? "Find study spots around the world.",
  };
}

export default async function StudySpotPage({ params }: Props) {
  const helpers = await createSSRHelper();
  await Promise.all([
    helpers.user.currentBySession.prefetch(),
    helpers.studySpot.bySlug.prefetch(params.slug),
    // helpers.studySpot.authorBySlug.prefetch(params.slug),
  ]);
  const dehydratedState = dehydrate(helpers.queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <StudySpotDetail slug={params.slug} />
    </ReactQueryHydrate>
  );
}
