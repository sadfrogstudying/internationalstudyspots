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

export const dynamicParams = false;

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
  const studySpot = await getUnique(db, {
    where: {
      slug,
    },
  });

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images ?? []

  return {
    title: studySpot?.name ?? "Study Spot",
    description: studySpot?.description ?? "A page about a study spot",
    // openGraph: {
    //   images: ['/some-specific-page-image.jpg', ...previousImages],
    // },
  };
}

export default function StudySpotPage({ params }: Props) {
  return <StudySpotDetail slug={params.slug} />;
}
