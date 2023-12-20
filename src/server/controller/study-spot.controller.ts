import type { PrismaClient, Prisma } from "@prisma/client";

export async function getManyHandler(
  db: PrismaClient,
  args?: Prisma.StudySpotFindManyArgs,
) {
  const spots = await db.studySpot.findMany({
    ...args,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      images: true,
      name: true,
      country: true,
      state: true,
      venueType: true,
      city: true,
      address: true,
      powerOutlets: true,
      wifi: true,
      naturalViews: true,
      latitude: true,
      longitude: true,
    },
  });

  return spots;
}

export async function getAllSlugs(db: PrismaClient) {
  const spots = await db.studySpot.findMany({
    select: {
      slug: true,
    },
  });

  return spots.map((spot) => spot.slug);
}

export async function getUnique(
  db: PrismaClient,
  args: Prisma.StudySpotFindUniqueArgs,
) {
  if (!args.where) throw new Error("Missing where clause");

  const studySpot = await db.studySpot.findUnique({
    ...args,
    include: {
      images: true,
    },
  });

  return studySpot;
}
