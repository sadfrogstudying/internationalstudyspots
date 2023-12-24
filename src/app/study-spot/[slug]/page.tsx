import StudySpotDetail from "@/components/study-spot-detail";
import { db } from "@/server/db";
import {
  type Metadata,
  // type ResolvingMetadata
} from "next";

/**
 * true: Dynamic segments not included in generateStaticParams are generated on demand.
 * false: Dynamic segments not included in generateStaticParams will return a 404.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const spots = await db.studySpot.findMany({
    select: {
      slug: true,
    },
  });

  return spots.map((spot) => spot.slug);
}

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  // parent: ResolvingMetadata,
): Promise<Metadata> {
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

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images ?? []
  return {
    title: name
      ? `${name} - International Study Spots`
      : "International Study Spots",
    description: descriptionString ?? "Find study spots around the world.",
    // openGraph: {
    //   images: ['/some-specific-page-image.jpg', ...previousImages],
    // },
  };
}

export default function StudySpotPage({ params }: Props) {
  return <StudySpotDetail slug={params.slug} />;
}
