import StudySpotDetail from "@/components/study-spot-detail";
import {
  getAllSlugs,
  getUnique,
} from "@/server/controller/study-spot-controller";
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
  const slugs = await getAllSlugs(db);

  return slugs.map((slug) => ({
    slug: slug,
  }));
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
    (await getUnique(db, {
      where: {
        slug,
      },
    })) ?? {};

  const wifiString = wifi && "Has wifi.";
  const powerOutletsString = powerOutlets && "Has power outlets.";
  const descriptionString = `${name} in ${state}, ${country}. ${wifiString} ${powerOutletsString}`;

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images ?? []
  return {
    title: name
      ? `${name} - International Study Spots`
      : "International Study Spots",
    description: descriptionString,
    // openGraph: {
    //   images: ['/some-specific-page-image.jpg', ...previousImages],
    // },
  };
}

export default function StudySpotPage({ params }: Props) {
  return <StudySpotDetail slug={params.slug} />;
}
