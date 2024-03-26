import ReactQueryHydrate from "@/components/react-query-hydrate";
import RedirectWrapper from "@/components/study-spot-detail/redirect-wrapper";
import { createSSRHelper } from "@/server/api/ssr";
import { db } from "@/server/db";
import { dehydrate } from "@tanstack/react-query";
import { type Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import Hero from "@/components/study-spot-detail/hero";
import Author from "@/components/study-spot-detail/author";
import Summary from "@/components/study-spot-detail/summary";
import Controls from "@/components/study-spot-detail/controls";
import StudySpotDetailMap from "@/components/study-spot-detail/map";

import List from "@/components/study-spot-detail/list";
import AllImages from "@/components/study-spot-detail/all-images";

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

// 1. Prefetching queries that we'll need on the server
// 2. "Hydrating" the react query cache with the data
// 3. All the client components that have useQuery will have data

export default async function StudySpotPage({ params }: Props) {
  const helpers = await createSSRHelper();

  await Promise.all([
    await helpers.studySpot.bySlug.prefetch(params.slug),
    await helpers.studySpot.authorBySlug.prefetch(params.slug),
  ]);

  const dehydratedState = dehydrate(helpers.queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <RedirectWrapper slug={params.slug}>
        <div className="space-y-12">
          <Hero slug={params.slug} />

          <div>
            <Separator className="mb-2" />
            <Summary slug={params.slug} />
            <div className="mt-4 flex gap-2">
              <Controls slug={params.slug} />
            </div>
          </div>

          <div>
            <Separator className="mb-2" />
            <Author slug={params.slug} />
          </div>

          <div>
            <Separator className="mb-2" />
            <div className="relative h-96 w-full bg-primary/10">
              <StudySpotDetailMap slug={params.slug} />
            </div>
          </div>

          <div>
            <Separator className="mb-2" />
            <List slug={params.slug} />
          </div>

          <div>
            <Separator className="mb-2" />
            <AllImages slug={params.slug} />
          </div>
        </div>
      </RedirectWrapper>
    </ReactQueryHydrate>
  );
}
