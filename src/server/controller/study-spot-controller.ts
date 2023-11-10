import type { PrismaClient, Prisma } from "@prisma/client";

export async function getManyHandler(
  db: PrismaClient,
  args?: Prisma.StudySpotFindManyArgs,
) {
  const spots = await db.studySpot.findMany({
    ...args,
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: true,
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
