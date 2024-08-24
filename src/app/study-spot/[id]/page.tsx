import { db } from "@/server/db";
import { type Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import Hero from "@/components/study-spot-detail/hero";
import Author from "@/components/study-spot-detail/author";
import Summary from "@/components/study-spot-detail/summary";
import Controls from "@/components/study-spot-detail/controls";
import StudySpotDetailMap from "@/components/study-spot-detail/map";

import List from "@/components/study-spot-detail/list";
import AllImages from "@/components/study-spot-detail/all-images";

import { unstable_cache } from "next/cache";

interface Params {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  // read route params
  const id = Number(params.id);

  // fetch data
  const { name, state, country, wifi, powerOutlets } =
    (await db.studySpot.findUnique({
      where: {
        id: id,
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

export async function generateStaticParams() {
  const spots = await db.studySpot.findMany({
    select: {
      id: true,
    },
  });

  return spots.map((spot) => ({
    id: String(spot.id),
  }));
}

async function getSpot(id: number) {
  console.log("🪰 Getting Spot...");

  return await db.studySpot.findUnique({
    where: {
      id: id,
    },
    include: {
      images: true,
    },
  });
}

const getCachedSpot = unstable_cache(
  async (id: number) => getSpot(id),
  undefined,
  {},
);

export default async function StudySpotPage({ params }: Params) {
  const spot = await getCachedSpot(Number(params.id));

  if (!spot) return <div>Bruh, there should be something here lol.</div>;

  return (
    <>
      <div className="space-y-12">
        <Hero spot={spot} />

        <div>
          <Separator className="mb-2" />
          <Summary spot={spot} />
          <div className="mt-4 flex gap-2">
            <Controls id={spot.id} />
          </div>
        </div>
        <div>
          <Separator className="mb-2" />
          <Author id={spot.id} />
        </div>

        <div>
          <Separator className="mb-2" />
          <div className="relative h-96 w-full bg-primary/10">
            <StudySpotDetailMap id={spot.id} />
          </div>
        </div>
        <div>
          <Separator className="mb-2" />
          <List id={spot.id} />
        </div>

        <div>
          <Separator className="mb-2" />
          <AllImages id={spot.id} />
        </div>
      </div>
    </>
  );
}
